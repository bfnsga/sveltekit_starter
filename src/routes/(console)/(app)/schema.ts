import { z } from 'zod';

// Form schema
export const feedbackSchema = z.object({
	message: z.string().min(1, { message: 'Required' })
});

export const supportSchema = z.object({
	subject: z.string().min(1, { message: 'Required' }),
	severity: z.enum(['Low', 'Medium', 'High'], { message: 'Required' }),
	message: z.string().min(1, { message: 'Required' })
});
