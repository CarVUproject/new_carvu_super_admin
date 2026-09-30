import { z } from 'zod';

export const superAdminReferralCommissionSchema = z.object({
  payout_reference: z.string(),
});

export type SuperAdminReferralCommissionFormValues = z.infer<
  typeof superAdminReferralCommissionSchema
>;
