import { z } from 'zod';

// Form schema
export const signupSchema = z.object({
	email: z.string().email()
});
