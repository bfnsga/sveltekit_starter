import { redirect } from '@sveltejs/kit';
import { stripe, supabaseAuth } from '$lib/clients';
import { fail } from '@sveltejs/kit';
import { getStripeId, toDateTime } from '$lib/utils';

const plans = [
	{
		name: 'Free',
		type: 'free',
		priceId: null,
		price: '0',
		limits: ['1,000 emails/month', 'No overage'],
		features: {
			included: ['1 user', '1 project', '1 GB storage'],
			excluded: ['Advanced features']
		}
	},
	{
		name: 'Pro',
		type: 'paid',
		priceId: 'price_1PquWBCcfAOQdYnZpweQEnve',
		price: '19',
		limits: ['10,000 emails/month', 'Additional usage: $1 / 200 emails'],
		features: {
			included: ['Unlimited users', 'Unlimited projects', 'Unlimited storage'],
			excluded: ['Advanced features']
		}
	}
];

const meteredPriceId = 'price_1Ps5chCcfAOQdYnZvFcWw8qh';

export const load = async ({ url, locals: { supabase, tenantId } }) => {
	// Params
	const upgradedDialog = url.searchParams.get('upgraded') === 'true';
	const update = url.searchParams.get('update') === 'true';

	if (update) {
		const stripeCustomerId = await getStripeId(supabase);
		const subscriptions = await stripe.subscriptions.list({
			customer: stripeCustomerId,
			limit: 1
		});

		if (subscriptions.data.length > 0) {
			const subscription = subscriptions.data[0];

			// Upsert subscription
			const { error } = await supabaseAuth.from('subscriptions').upsert({
				id: subscription.id,
				item_id: subscription.items.data[0].id,
				price_id: subscription.items.data[0].price.id,
				cancel_at_period_end: subscription.cancel_at_period_end,
				current_period_start: toDateTime(subscription.current_period_start),
				current_period_end: toDateTime(subscription.current_period_end),
				tenant_id: tenantId
			});

			if (error) {
				throw new Error();
			}
		}

		return redirect(303, '/billing');
	}

	// Get the current subscription
	const { data: subscriptionRecord } = await supabase.from('subscriptions').select().single();
	const subscribedPriceId = subscriptionRecord?.price_id || null;
	const subscribedPlan = plans.find((plan) => plan.priceId === subscribedPriceId) ?? plans[0];
	const cancelled = subscriptionRecord?.cancel_at_period_end;

	// Calculate billing period
	let billingPeriod = {
		start: '',
		end: ''
	};
	if (!subscribedPriceId) {
		const { firstDay, lastDay } = getFirstAndLastDayOfMonth();
		billingPeriod.start = firstDay;
		billingPeriod.end = lastDay;
	} else {
		const { current_period_start, current_period_end } = subscriptionRecord;
		billingPeriod.start = formatIsoDate(current_period_start);
		billingPeriod.end = formatIsoDate(current_period_end);
	}

	// Return
	return {
		plans,
		subscribedPlan,
		billingPeriod,
		cancelled
	};
};

export const actions = {
	customerPortal: async ({ url, locals: { supabase } }) => {
		// StripeId
		const stripeCustomerId = await getStripeId(supabase);

		// Create a portal
		const customerPortal = await customerPortalURL(stripeCustomerId, url);

		// Redirect
		return redirect(303, customerPortal);
	},
	changePlan: async ({ request, url, locals: { supabase, tenantId } }) => {
		// Payload
		const data = await request.formData();
		const priceId = data.get('priceId') || null;

		// Validate
		const newPlan = plans.filter((plan) => plan.priceId === priceId);

		if (newPlan.length === 0) {
			return fail(400);
		}

		// StripeID
		const stripeCustomerId = await getStripeId(supabase);

		// Subscription
		const { data: subscriptionRecord } = await supabase.from('subscriptions').select().single();
		const subscription = subscriptionRecord?.id || null;

		// Check plan type
		if (newPlan[0].type === 'free') {
			// Check if subscription exists
			if (!subscription) {
				throw new Error();
			}

			// Customer portal session
			const session = await stripe.billingPortal.sessions.create({
				customer: stripeCustomerId,
				flow_data: {
					type: 'subscription_cancel',
					subscription_cancel: {
						subscription
					},
					after_completion: {
						type: 'redirect',
						redirect: {
							return_url: `${url.origin}/billing?update=true`
						}
					}
				},
				return_url: `${url.origin}/update=true`
			});

			return redirect(303, session.url);
		}

		// Check if subscription exists
		if (!subscription) {
			// Checkout ID
			const checkoutId = crypto.randomUUID();

			// Stripe Checkout
			const session = await stripe.checkout.sessions.create({
				//@ts-ignore
				customer: stripeCustomerId as string,
				client_reference_id: tenantId,
				success_url: `${url.origin}/billing?update=true`,
				cancel_url: `${url.origin}/billing?update=true`,
				line_items: [
					{
						price: priceId,
						quantity: 1
					},
					{
						price: meteredPriceId
					}
				],
				mode: 'subscription'
			});

			// Create checkout session
			const { error: insertCheckoutSessionError } = await supabase
				.from('checkout_sessions')
				.insert({
					id: checkoutId,
					stripe_checkout_session_id: session.id,
					tenant_id: tenantId
				});

			if (insertCheckoutSessionError) {
				return fail(500);
			}

			// Redirect
			if (session.url) {
				return redirect(303, session.url);
			}
		}

		// Create a portal
		const customerPortal = await customerPortalURL(stripeCustomerId, url);

		// Redirect
		return redirect(303, customerPortal);
	}
};

async function customerPortalURL(stripeCustomerId: string, url: URL) {
	// Create a portal
	const session = await stripe.billingPortal.sessions.create({
		customer: stripeCustomerId,
		return_url: `${url.origin}/billing?update=true`
	});

	return session.url;
}

function getFirstAndLastDayOfMonth(): { firstDay: string; lastDay: string } {
	const now = new Date();

	// Get the first day of the current month
	const firstDayDate = new Date(now.getFullYear(), now.getMonth(), 1);
	const firstDay = firstDayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

	// Get the last day of the current month
	const lastDayDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
	const lastDay = lastDayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

	return { firstDay, lastDay };
}

function formatIsoDate(isoDateString: string): string {
	const date = new Date(isoDateString);
	return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
