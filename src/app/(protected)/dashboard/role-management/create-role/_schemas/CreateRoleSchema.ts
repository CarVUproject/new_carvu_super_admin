import z from 'zod';

export const CreateRoleSchema = z.object({
  name: z
    .string()
    .refine((val) => val.trim().length > 0, {
      message: 'Name is required',
    })
    .refine((val) => val.trim().length >= 2, {
      message: 'Name must be at least 2 characters',
    }),
  permissions: z.array(z.string()).min(1, 'At least one permission must be selected'),
  is_active: z.boolean(),
});

export type CreateRoleType = z.infer<typeof CreateRoleSchema>;
