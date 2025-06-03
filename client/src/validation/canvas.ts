import { z } from 'zod';

export const createSchema = z.object({
  name: z.string(),
  description: z.string(),
  width: z.number().min(10).max(10000).optional(),
  height: z.number().min(10).max(10000).optional(),
});

export type ICreate = z.infer<typeof createSchema>;
