import { z } from 'zod';

const entitlementSchema = z.object({
  operation: z.string().min(1),
  is_enabled: z.boolean(),
  limit_value: z.number().nullable(),
  is_unlimited: z.boolean(),
});

export const superAdminSubscriptionPlanSchema = z.object({
  code: z.string().min(1, 'Plan code is required'),
  name: z.string().min(1, 'Plan name is required'),
  description: z.string(),
  monthly_price: z
    .string()
    .min(1, 'Monthly price is required')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: 'Monthly price must be a valid positive number',
    }),
  currency: z.string().min(1, 'Currency is required'),
  stripe_price_id: z.string(),
  required_permission_codes: z.array(z.string()),
  features: z.string(),
  display_order: z.number().min(0, 'Display order is required'),
  is_featured: z.boolean(),
  is_active: z.boolean(),
  entitlements: z.array(entitlementSchema),
});

export type SuperAdminSubscriptionPlanFormValues = z.infer<typeof superAdminSubscriptionPlanSchema>;
