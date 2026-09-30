import { z } from 'zod';

const moneyField = z
  .string()
  .min(1, 'Commission amount is required')
  .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
    message: 'Commission amount must be a valid positive number',
  });

const integerField = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine((value) => /^\d+$/.test(value) && Number(value) >= 0, {
      message: `${label} must be a valid whole number`,
    });

export const superAdminReferralSettingsSchema = z.object({
  affiliate_commission_amount: moneyField,
  affiliate_max_qualified_purchases_per_referred_user: integerField('Max qualified purchases'),
  affiliate_attribution_window_days: integerField('Attribution window'),
});

export type SuperAdminReferralSettingsFormValues = z.infer<typeof superAdminReferralSettingsSchema>;
