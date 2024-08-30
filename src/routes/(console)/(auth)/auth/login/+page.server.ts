import { redirect, fail, error } from '@sveltejs/kit';
import { superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from './schema';

// Load
export const load = async () => {
	const form = await superValidate(zod(loginSchema));

	return { form };
};

// Actions
export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		// Validate form
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Payload
		const { email } = form.data;

		// Sign up
		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: { shouldCreateUser: false }
		});
		if (error) {
			if (error.message === 'Signups not allowed for otp') {
				return setError(form, 'email', 'Email not found. Please sign up.');
			}

			throw new Error();
		} else {
			redirect(303, `/auth/verify?email=${encodeURIComponent(email)}`);
		}
	}
};
