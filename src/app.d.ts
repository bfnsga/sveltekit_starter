import type { Session, SupabaseClient, User } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Error {
			code: string;
		}
		interface Locals {
			supabase: SupabaseClient;
			safeGetSession: () => Promise<{
				session: Session | null;
				user: User | null;
				tenantId: string | null;
			}>;
			session: Session | null;
			user: User | null;
			tenantId: string | null;
			isAPI: boolean;
			apiKey: string | null;
			isAuthenticated: boolean;
			subscription: {
				id: string;
				customerId: string;
				priceId: string;
			};
		}
		interface PageData {
			session: Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
