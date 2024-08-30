import { z } from 'zod';

// Schema
export const querySchema = z.object({
	email: z.string().email()
});

export const codeSchema = z.object({
	code: z.array(z.string().length(1)).length(6)
});
