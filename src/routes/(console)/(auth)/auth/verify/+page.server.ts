import { fail, redirect } from '@sveltejs/kit';
import { superValidate, setError } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { querySchema, codeSchema } from './schema';
import { dev } from '$app/environment';
import { supabaseAuth } from '$lib/clients';
import type { User } from '@supabase/supabase-js';

// Load
export const load = async ({ url }) => {
	// Query string params
	const email = url.searchParams.get('email') as string;

	const data = {
		email
	};

	// Validate query string parameters
	const queryParams = await superValidate(data, zod(querySchema));

	if (!queryParams.valid) {
		return redirect(303, '/auth/login');
	}

	// Load form for frontend
	const form = await superValidate(zod(codeSchema));

	// Return
	return { form };
};

// Actions
export const actions = {
	default: async ({ request, url, locals: { supabase, safeGetSession } }) => {
		// Validate form
		const form = await superValidate(request, zod(codeSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Payload
		const { code } = form.data;
		const email = url.searchParams.get('email') as string;

		// Verify code
		const formattedCode = code.join('');

		// Supabase
		const { error } = await supabase.auth.verifyOtp({ email, token: formattedCode, type: 'email' });

		if (error) {
			if (error.message === 'Token has expired or is invalid') {
				form.data.code = ['', '', '', '', '', ''];
				// @ts-ignore: Suppress TypeScript error for setError function call
				return setError(form, 'code', 'Invalid or expired code.');
			}

			throw new Error();
		}

		// Clear data
		const { user } = await safeGetSession();
		await clearUserData(user as User);

		// Redirect
		return redirect(303, '/dashboard');
	}
};

async function clearUserData(user: User) {
	//////
	const userId = user?.id as string;
	let metadataChanged = false;

	//////
	if (user?.user_metadata) {
		if ('tenant_id' in user.user_metadata) {
			user.app_metadata.tenant_id = user.user_metadata.tenant_id;
			user.user_metadata.tenant_id = null;
			metadataChanged = true;
		}

		if ('role' in user.user_metadata) {
			user.app_metadata.role = user.user_metadata.role;
			user.user_metadata.role = null;
			metadataChanged = true;
		}

		if ('sub' in user.user_metadata) {
			user.user_metadata.sub = null;
			metadataChanged = true;
		}

		if ('email' in user.user_metadata) {
			user.user_metadata.email = null;
			metadataChanged = true;
		}

		if ('email_verified' in user.user_metadata) {
			user.user_metadata.email_verified = null;
			metadataChanged = true;
		}

		if ('phone_verified' in user.user_metadata) {
			user.user_metadata.phone_verified = null;
			metadataChanged = true;
		}

		//////
		if (metadataChanged) {
			const { error } = await supabaseAuth.auth.admin.updateUserById(userId, {
				user_metadata: user.user_metadata,
				app_metadata: user.app_metadata
			});

			if (error) {
				throw new Error();
			}
		}
	}
}
