import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import {
	RESEND_API_KEY,
	STRIPE_API_KEY,
	SUPABASE_SERVICE_ROLE_KEY
} from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import Stripe from 'stripe';

export const resend = new Resend(RESEND_API_KEY);

export const stripe = new Stripe(STRIPE_API_KEY);

export const supabaseAuth = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);