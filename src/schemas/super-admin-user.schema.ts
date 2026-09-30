import { z } from 'zod';

export const superAdminUserSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  phone: z.string().optional(),
  is_active: z.boolean(),
  roles: z.array(z.string()),
});

export type SuperAdminUserFormValues = z.infer<typeof superAdminUserSchema>;
