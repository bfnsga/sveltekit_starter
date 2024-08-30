import { dev } from '$app/environment';
import { resend } from '$lib/clients';
import { ADMIN_EMAIL, APP_NAME, EMAIL_DOMAIN } from '$env/static/private';
import type { SupabaseClient } from '@supabase/supabase-js';

// Types
interface EmailOptions {
	subject: string;
	html: string;
	replyTo?: string;
}

// Functions
export async function sendEmail({ subject, html, replyTo }: EmailOptions) {
	const from = `${APP_NAME} <no-reply@${EMAIL_DOMAIN}>`;
	if (dev) {
		const nodemailer = await import('nodemailer');

		const transporter = nodemailer.createTransport({
			host: 'localhost',
			port: 54325,
			secure: false,
			tls: {
				rejectUnauthorized: false
			}
		});

		try {
			await transporter.sendMail({
				from,
				to: 'inbox@example.com',
				subject,
				html,
				replyTo
			});
		} catch (error) {
			throw new Error('Failed to send email');
		}
	} else {
		const { error } = await resend.emails.send({
			from,
			to: [ADMIN_EMAIL],
			reply_to: replyTo,
			subject,
			html
		});

		if (error) {
			throw new Error('Failed to send email');
		}
	}
}

export async function getStripeId(supabase: SupabaseClient) {
	const { data } = await supabase.from('tenants').select('stripe_customer_id').single();
	return data?.stripe_customer_id || undefined;
}

export function toDateTime(timestamp: number) {
	const date = new Date(timestamp * 1000);
	const utcString = date.toISOString();
	return utcString;
};
