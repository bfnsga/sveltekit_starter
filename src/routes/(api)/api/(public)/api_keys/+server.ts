import { json, error } from '@sveltejs/kit';
import { supabaseAuth } from '$lib/clients';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, fail } from 'sveltekit-superforms';
import { apiKeys } from '$lib/schema';
import { throwError } from '$lib/errors';

export const POST = async ({ request, locals: { tenantId } }) => {
    // Payload
    const payload = await request.json();

	// Validate
    const form = await superValidate(payload, zod(apiKeys.create));
    
    if (!form.valid) {
        return throwError('INVALID_REQUEST')
    }
    
    // Payload
    const { name } = form.data;

	// Insert record
	const { data, error } = await supabaseAuth.rpc('create_key', {
		length: 32,
		key_name: name,
		tenant: tenantId
	});

    if (error) {
        console.error(error.message);
		return throwError('INTERNAL_SERVER_ERROR')
	}

	// Return
	return json({ data });
};

export const GET = async ({ locals: { tenantId } }) => {
	// Select record
	const { data, error: supabaseError } = await supabaseAuth
		.from('api_keys')
		.select('id, created_at, last_used_at, key_partial, name')
		.eq('tenant_id', tenantId)
		.order('created_at', { ascending: false });

    if (supabaseError) {
        console.error(supabaseError.message);
        return throwError('INTERNAL_SERVER_ERROR')
	}

	// Return
	return json({ data });
};

// Fallback
export const fallback = async () => {
    return throwError('NOT_FOUND');
};
