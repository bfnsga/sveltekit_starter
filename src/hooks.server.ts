import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect, error } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { supabaseAuth } from '$lib/clients';

// Function(s)
const api: Handle = async ({ event, resolve }) => {
	// Check if API call
	const path = event.url.pathname;
	event.locals.isAPI = false;

	if (!path.startsWith('/api/')) {
		return resolve(event);
	}

	// Set variables
	event.locals.isAPI = true;
	const apiKey = event.request.headers.get('authorization')?.replace(/^Bearer\s+/, '') || null;

	// Check if path exists
	const publicPaths = ['/api/emails', '/api/verify', '/api/api_keys'];
	const privatePaths = ['/api/stripe', '/api/ses'];

	if (!publicPaths.includes(path) && !privatePaths.includes(path)) {
		return error(404, {
			code: 'NOT_FOUND',
			message: 'The requested endpoint does not exist.'
		});
	}

	// Validate authentication
	if (apiKey && publicPaths.includes(path)) {
		const { data: tenantId, error: validateKeyError } = await supabaseAuth.rpc('validate_key', {
			api_key: apiKey
		});

		if (validateKeyError) {
			return error(500, {
				code: 'INTERNAL_SERVER_ERROR',
				message: 'An internal server error occurred.'
			});
		}

		if (!tenantId) {
			return error(403, {
				code: 'INVALID_API_KEY',
				message: 'The API key is not valid.'
			});
		}

		event.locals.tenantId = tenantId;
		event.locals.isAuthenticated = true;
	}

	// Return
	return resolve(event);
};

const supabase: Handle = async ({ event, resolve }) => {
	// Skip if authenticated API call
	if (event.locals.isAPI && event.locals.isAuthenticated) {
		return resolve(event);
	}

	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			/**
			 * SvelteKit's cookies API requires `path` to be explicitly set in
			 * the cookie options. Setting `path` to `/` replicates previous/
			 * standard behavior.
			 */
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (!session) {
			return { session: null, user: null, tenantId: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null, tenantId: null };
		}

		// Return
		return { session, user, tenantId: user?.app_metadata.tenant_id ?? null };
	};

	// Return
	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	// Skip if authenticated API call
	if (event.locals.isAPI && event.locals.isAuthenticated) {
		return resolve(event);
	}

	// Set data
	const pathname = event.url.pathname;
	const method = event.request.method;
	const { session, user, tenantId } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;
	event.locals.tenantId = tenantId;

	if (event.locals.isAPI && !event.locals.isAuthenticated) {
		if (session && user && tenantId) {
			event.locals.tenantId = tenantId;
			return resolve(event);
		} else {
			return error(401, {
				code: 'MISSING_API_KEY',
				message: 'Missing API key in the authorization header.'
			});
		}
	}

	if (!session && !pathname.includes('/auth')) {
		redirect(303, '/auth/login');
	}

	if (
		session &&
		pathname !== '/dashboard' &&
		(pathname.includes('/auth') || (pathname === '/' && method === 'GET'))
	) {
		redirect(303, '/dashboard');
	}

	return resolve(event);
};

export const handle: Handle = sequence(api, supabase, authGuard);
