import { z } from 'zod';

// API Keys
export const apiKeys = {
	create: z.object({
		name: z.string().min(1).max(50)
	}),
	delete: z.object({
		id: z.string().min(1)
	})
};
