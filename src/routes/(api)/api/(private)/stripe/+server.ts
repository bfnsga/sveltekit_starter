import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { throwError } from '$lib/errors';
import { toDateTime } from '$lib/utils';
import { stripe, supabaseAuth } from '$lib/clients';

////////////////////////////////////////////////////////////////
// Route(s)
////////////////////////////////////////////////////////////////
export const POST = async ({ request }) => {
	// Payload
	const body = await request.text();
	const sig = request.headers.get('stripe-signature') as string;
	const webhookSecret = STRIPE_WEBHOOK_SECRET;
	let event: Stripe.Event | null = null;

	// Validate webhook
	if (!sig || !webhookSecret) throwError('internal_server_error');
	try {
		event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret);
	} catch {
		return new Response('Unauthorized', { status: 401 });
	}

	// Handle event
	if (event) {
		switch (event.type) {
			case 'customer.subscription.created':
			case 'customer.subscription.updated':
			case 'customer.subscription.deleted':
				await manageSubscription(event.type, event.data.object as Stripe.Subscription);
				break;
		}
	}

	return json({
		ok: true
	});
};

////////////////////////////////////////////////////////////////
// Function(s)
////////////////////////////////////////////////////////////////
async function manageSubscription(
	eventType:
		| 'customer.subscription.created'
		| 'customer.subscription.updated'
		| 'customer.subscription.deleted',
	subscription: Stripe.Subscription
) {
	// Get tenantId
	const stripeCustomerId = subscription.customer as string;
    const {data: tenant} = await supabaseAuth
        .from('tenants')
        .select('id')
        .eq('stripe_customer_id', stripeCustomerId)
        .single();
    
    const tenantId = tenant?.id as string;

	// Insert data
	if (eventType !== 'customer.subscription.deleted') {
		const insertData = {
			id: subscription.id,
            item_id: subscription.items.data[0].id,
            price_id: subscription.items.data[0].price.id,
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: toDateTime(subscription.current_period_start),
            current_period_end: toDateTime(subscription.current_period_end),
			tenantId
		};

		// Insert or update subscription
		if (eventType === 'customer.subscription.created') {
            // Insert data
            await supabaseAuth
                .from('subscriptions')
                .insert(insertData);
		} else if (eventType === 'customer.subscription.updated') {
			// Check if current_period_end has changed (indicates a plan renewal)
			const {data: currentSubscription} = await supabaseAuth
                .from('subscriptions')
                .select()
                .eq('id', subscription.id)
                .single();

			// Update subscription if current_period_end has changed
			if (currentSubscription?.currentPeriodEnd !== toDateTime(subscription.current_period_end)) {
				// Update data
                await supabaseAuth
                    .from('subscriptions')
                    .upsert(insertData);
			}
		}
	} else {
        // If paid subscription was cancelled, delete subscription
        await supabaseAuth
            .from('subscriptions')
            .delete()
            .eq('id', subscription.id);
	}
}

////////////////////////////////////////////////////////////////
// Fallback
////////////////////////////////////////////////////////////////
export const fallback = async () => {
	return throwError('NOT_FOUND');
};
