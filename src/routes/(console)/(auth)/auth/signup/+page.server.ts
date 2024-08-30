import { redirect, fail, error } from '@sveltejs/kit';
import { superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signupSchema } from './schema';

// Load
export const load = async () => {
	const form = await superValidate(zod(signupSchema));

	return { form };
};

// Actions
export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		// Validate form
		const form = await superValidate(request, zod(signupSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Payload
		const { email } = form.data;

		// Sign up
		const { error } = await supabase.auth.signInWithOtp({ email });
		if (error) {
			if (error.message === 'User already registered') {
				return setError(form, 'email', 'An account with this email already exists.');
			}

			console.log(error.message);

			throw new Error();
		} else {
			redirect(303, `/auth/verify?email=${encodeURIComponent(email)}`);
		}
	}
};
