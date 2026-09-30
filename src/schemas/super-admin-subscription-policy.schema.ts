import { z } from 'zod';

export const superAdminSubscriptionPolicySchema = z.object({
  subscription_required: z.boolean(),
  is_active: z.boolean(),
});

export type SuperAdminSubscriptionPolicyFormValues = z.infer<
  typeof superAdminSubscriptionPolicySchema
>;
