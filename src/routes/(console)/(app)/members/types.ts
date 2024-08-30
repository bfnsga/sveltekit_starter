export type Users = {
	id: string;
	created_at: string;
	invited_at: string;
	joined_at: string;
	email: string;
	role: string;
	name: string | null;
	avatar_url: string | null;
	pending: boolean;
	tenant_id: string;
};
