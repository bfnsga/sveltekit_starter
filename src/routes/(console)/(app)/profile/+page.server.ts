import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, setError } from 'sveltekit-superforms';
import { emailSchema, codeSchema } from './schema';
import { fail } from '@sveltejs/kit';

// Load
export const load = async ({ locals: { safeGetSession } }) => {
	//////
	const { user } = await safeGetSession();
	const email = user?.email as string;

	//////
	const emailForm = await superValidate({ email }, zod(emailSchema));
	const verifyForm = await superValidate(zod(codeSchema));

	//////
	return { email, emailForm, verifyForm };
};

// Actions
export const actions = {
	updateEmail: async ({ request, locals: { supabase, safeGetSession } }) => {
		// Validate form
		const form = await superValidate(request, zod(emailSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Data
		const { email } = form.data;
		const { user } = await safeGetSession();
		const currentEmail = user?.email as string;

		// Check if email is different
		if (email === currentEmail) {
			return setError(form, 'email', 'Email is the same.');
		}

		// Update email
		const { error: updateEmailError } = await supabase.auth.updateUser({
			email
		});

		if (updateEmailError) {
			if (updateEmailError.code === 'email_exists') {
				return setError(form, 'email', updateEmailError.message);
			}

			throw new Error();
		}
	},
	verifyCode: async ({ request, locals: { supabase } }) => {
		// Validate form
		const form = await superValidate(request, zod(codeSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Payload
		const { code, email } = form.data;

		// Verify code
		const formattedCode = code.join('');

		// Supabase
		const { error } = await supabase.auth.verifyOtp({
			email,
			token: formattedCode,
			type: 'email_change'
		});

		if (error) {
			if (error.message === 'Token has expired or is invalid') {
				form.data.code = ['', '', '', '', '', ''];
				// @ts-ignore: Suppress TypeScript error for setError function call
				return setError(form, 'code', 'Invalid or expired code.');
			}

			throw new Error();
		}
	}
};
