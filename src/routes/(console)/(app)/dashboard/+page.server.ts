import { stripe, supabaseAuth } from '$lib/clients';

// Load
export const load = async ({ fetch, locals: { supabase, tenantId } }) => {
	// Testing
	const res = await fetch('/api/testing');

	// Onboarding
	const { data: tenant, error: tenantError } = await supabase
		.from('tenants')
		.select('stripe_customer_id, onboarded')
		.single();

	if (tenantError) {
		throw new Error();
	}

	if (!tenant.stripe_customer_id) {
		// Create Stripe customer
		const customer = await stripe.customers.create();

		// Update tenant
		const { error: tenantError } = await supabaseAuth
			.from('tenants')
			.update({
				stripe_customer_id: customer.id
			})
			.eq('id', tenantId);

		if (tenantError) {
			throw new Error();
		}
	}

	// Return
	return {
		onboarding: !tenant.onboarded
	};
};

// Actions
export const actions = {
	onboard: async ({ locals: { tenantId } }) => {
		// Update tenant
		const { error: tenantError } = await supabaseAuth
			.from('tenants')
			.update({
				onboarded: true
			})
			.eq('id', tenantId);

		if (tenantError) {
			throw new Error();
		}
	}
};
