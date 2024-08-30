import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, setError, fail } from 'sveltekit-superforms';
import { apiKeys } from '$lib/schema';

// Load
// export const load = async ({ fetch, locals: { supabase } }) => {
// 	// Form
// 	const createApiKeyForm = await superValidate(zod(apiKeys.create));

// 	// Fetch
// 	const res = await fetch('/api/api_keys');

// 	if (!res.ok) {
// 		console.log('response not okay');
// 	}

// 	// Payload
// 	const { data } = await res.json();

// 	// Return
// 	return {
// 		apiKeys: data,
// 		forms: {
// 			createApiKeyForm
// 		}
// 	};
// };

// Actions
// export const actions = {
// 	create: async ({ request, fetch }) => {
// 		// Payload
// 		const payload = await request.formData();
// 		const {name} = 
// 		console.log(payload)
// 		// Validate
// 		const form = await superValidate(request, zod(apiKeys.create));

// 		if (!form.valid) {
// 			return fail(400, { form });
// 		}

// 		// Payload
// 		const { name } = form.data;

// 		// Fetch
// 		const res = await fetch('/api/api_keys', {
// 			method: 'POST',
// 			body: JSON.stringify({
// 				name
// 			})
// 		});

// 		if (!res.ok) {
// 			throw new Error();
// 		}

// 		// Payload
// 		const { data } = await res.json();

// 		// Return
// 		return {
// 			apiKey: data
// 		};
// 	},
// 	deleteKey: async ({ request, locals: { supabase } }) => {
// 		// Validate
// 		const form = await superValidate(request, zod(apiKeys.delete));

// 		if (!form.valid) {
// 			return fail(400, { form });
// 		}

// 		// Payload
// 		const { id } = form.data;

// 		// Delete record
// 		await supabase.from('api_keys').delete().eq('id', id);
// 	}
// };
