import { zod } from 'sveltekit-superforms/adapters';
import { superValidate, setError } from 'sveltekit-superforms';
import { userSchema, idSchema, editRoleSchema } from './schema';
import { fail } from '@sveltejs/kit';
import { supabaseAuth } from '$lib/clients';

// Load
export const load = async ({ locals: { supabase, safeGetSession } }) => {
	//////
	const { user } = await safeGetSession();
	const userRole = user?.app_metadata.role as string;

	//////
	const { data: users, error } = await supabase.from('users').select();

	if (error) {
		throw new Error();
	}

	//////
	const form = await superValidate(zod(userSchema));

	//////
	return { users, form, userRole };
};

export const actions = {
	invite: async ({ request, locals: { safeGetSession } }) => {
		// Validate form
		const form = await superValidate(request, zod(userSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Data
		const { email, role } = form.data;
		const { user } = await safeGetSession();
		const tenantId = user?.app_metadata.tenant_id as string;

		// Invite user
		await inviteUser(email, role, tenantId);
	},
	delete: async ({ request, locals: { safeGetSession } }) => {
		// Payload
		const data = await request.formData();

		// Validate form
		const form = await superValidate(data, zod(idSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Data
		const { id } = form.data;

		// Validate role
		const { user } = await safeGetSession();
		const role = user?.app_metadata.role as string;

		if (!role.includes('owner')) {
			return fail(400, { form });
		}

		// Delete user
		const { error } = await supabaseAuth.auth.admin.deleteUser(id);

		if (error) {
			return fail(400, { form });
		}
	},
	editRole: async ({ request, locals: { safeGetSession, supabase } }) => {
		// Payload
		const data = await request.formData();

		// Validate form
		const form = await superValidate(data, zod(editRoleSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Data
		const { id, role } = form.data;

		// Validate role
		const { user } = await safeGetSession();
		const currentRole = user?.app_metadata.role as string;

		if (currentRole !== 'owner') {
			return fail(400, { form });
		}

		// Check if updated user is an owner
		const { data: userRecord, error: userRecordError } = await supabase
			.from('users')
			.select('role')
			.eq('id', id);

		if (userRecordError) {
			throw new Error();
		}

		const userToUpdateRole = userRecord?.[0].role as string;

		if (userToUpdateRole === 'owner') {
			throw new Error();
		}

		// Delete user
		const { error } = await supabaseAuth.auth.admin.updateUserById(id, {
			app_metadata: { role: role.toLowerCase() }
		});

		if (error) {
			return fail(400, { form });
		}
	},
	resendInvite: async ({ request, locals: { supabase, safeGetSession } }) => {
		// Payload
		const data = await request.formData();

		// Validate form
		const form = await superValidate(data, zod(idSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// Data
		const { id } = form.data;

		// Validate role
		const { user } = await safeGetSession();
		const currentUserRole = user?.app_metadata.role as string;

		if (!currentUserRole.includes('owner')) {
			return fail(400, { form });
		}

		// Look up user
		const { data: userRecord, error } = await supabase
			.from('users')
			.select('email, role, tenant_id')
			.eq('id', id)
			.single();

		const email = userRecord?.email as string;
		const role = userRecord?.role as string;
		const tenantId = user?.app_metadata.tenant_id as string;

		// Resend invite
		await inviteUser(email, role, tenantId);
	}
};

// Functions
async function inviteUser(email: string, role: string, tenantId: string) {
	const userInviteData = {
		data: {
			tenant_id: tenantId,
			role: role.toLowerCase()
		}
	};

	const { data, error: inviteUserError } = await supabaseAuth.auth.admin.inviteUserByEmail(
		email,
		userInviteData
	);

	if (inviteUserError) {
		throw new Error();
	}

	const userId = data.user.id;
	const invitedAt = data.user.invited_at;

	const { error: userInsertError } = await supabaseAuth.from('users').upsert({
		id: userId,
		invited_at: invitedAt,
		email,
		role: role.toLowerCase(),
		pending: true,
		tenant_id: tenantId
	});

	if (userInsertError) {
		throw new Error();
	}
}
