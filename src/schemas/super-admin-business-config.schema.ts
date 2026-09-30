import { z } from 'zod';

const moneyField = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: `${label} must be a valid positive number`,
    });

const integerField = (label: string) =>
  z
    .string()
    .min(1, `${label} is required`)
    .refine((value) => /^\d+$/.test(value) && Number(value) >= 0, {
      message: `${label} must be a valid whole number`,
    });

export const superAdminBusinessConfigSchema = z.object({
  retainer_amount: moneyField('Retainer amount'),
  penalty_amount: moneyField('Penalty amount'),
  platform_fee_amount: moneyField('Platform fee amount'),
  affiliate_commission_amount: moneyField('Affiliate commission amount'),
  affiliate_max_qualified_purchases_per_referred_user: integerField('Maximum qualified purchases'),
  affiliate_attribution_window_days: integerField('Attribution window'),
  pickup_confirmation_hours: integerField('Pickup confirmation hours'),
});

export type SuperAdminBusinessConfigFormValues = z.infer<typeof superAdminBusinessConfigSchema>;
