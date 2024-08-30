import { z } from 'zod';

// Form schema
export const emailSchema = z.object({
	email: z.string().email()
});

export const codeSchema = z.object({
	code: z.array(z.string().length(1)).length(6),
	email: z.string().email()
});
