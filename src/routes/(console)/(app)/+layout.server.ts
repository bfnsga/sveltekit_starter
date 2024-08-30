import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { feedbackSchema, supportSchema } from './schema';

// Load
export const load = async ({ locals: { safeGetSession } }) => {
	//////
	const { user } = await safeGetSession();
	const email = user?.email as string;
	const avatar = email.charAt(0).toUpperCase();

	//////
	const feedbackForm = await superValidate(zod(feedbackSchema));
	const supportForm = await superValidate(zod(supportSchema));

	//////
	return { email, avatar, feedbackForm, supportForm };
};
