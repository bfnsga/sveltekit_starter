import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { feedbackSchema, supportSchema } from './schema';
import { sendEmail } from '$lib/utils';

// Actions
export const actions = {
	feedback: async ({ request, locals: { safeGetSession } }) => {
		// Validate form
		const form = await superValidate(request, zod(feedbackSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Data
		const { user } = await safeGetSession();
		const email = user?.email as string;
		const { message } = form.data;

		// Send email
		await sendEmail({
			subject: 'Feedback',
			html: `<strong>Message:</strong><br />${message}`,
			replyTo: email
		});
	},
	supportTicket: async ({ request, locals: { safeGetSession } }) => {
		// Validate form
		const form = await superValidate(request, zod(supportSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Data
		const { user } = await safeGetSession();
		const email = user?.email as string;
		const { subject, severity, message } = form.data;

		// Send email
		await sendEmail({
			subject: 'Support Ticket',
			html: `<strong>Severity:</strong><br />${severity}<br /><br /><strong>Subject:</strong><br />${subject}<br /><br /><strong>Message:</strong><br />${message}`,
			replyTo: email
		});
	},
	logout: async ({ locals: { supabase, safeGetSession } }) => {
		// Get session
		const { session } = await safeGetSession();

		// Logout
		if (session) {
			await supabase.auth.signOut();
			redirect(303, '/auth/login');
		}
	}
};
