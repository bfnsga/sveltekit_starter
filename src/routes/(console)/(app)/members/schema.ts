import { z } from 'zod';

// Form schema
export const userSchema = z.object({
	email: z.string().email(),
	role: z.enum(['Member', 'Owner'], { message: 'Required' })
});

export const editRoleSchema = z.object({
	id: z.string().uuid(),
	email: z.string().email(),
	role: z.enum(['Member', 'Owner'], { message: 'Required' })
});

export const idSchema = z.object({
	id: z.string().uuid()
});
