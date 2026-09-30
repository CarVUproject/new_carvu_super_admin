import { z } from 'zod';

export const superAdminRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  is_active: z.boolean(),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
});

export type SuperAdminRoleFormValues = z.infer<typeof superAdminRoleSchema>;
