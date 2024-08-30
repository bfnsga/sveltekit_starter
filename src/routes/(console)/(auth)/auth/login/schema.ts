import { z } from 'zod';

// Form schema
export const loginSchema = z.object({
	email: z.string().email()
});
