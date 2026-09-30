'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { AdminPageScaffold, AdminSectionCard } from '@/components/admin/AdminPageScaffold';
import CvInput from '@/components/ui/CvInput';
import ErrorLabel from '@/components/ui/ErrorLabel';
import SubmitButton from '@/components/ui/SubmitButton';
import {
  useGetSuperAdminBusinessConfigQuery,
  useUpdateSuperAdminBusinessConfigMutation,
} from '@/features/super-admin/superAdminApi';
import { formatDate } from '@/lib/format';
import {
  superAdminBusinessConfigSchema,
  type SuperAdminBusinessConfigFormValues,
} from '@/schemas/super-admin-business-config.schema';

export default function BusinessConfigPage() {
  const { data, isLoading } = useGetSuperAdminBusinessConfigQuery();
  const [updateBusinessConfig, { isLoading: isSaving }] =
    useUpdateSuperAdminBusinessConfigMutation();

  const form = useForm<SuperAdminBusinessConfigFormValues>({
    resolver: zodResolver(superAdminBusinessConfigSchema),
    defaultValues: {
      retainer_amount: '',
      penalty_amount: '',
      platform_fee_amount: '',
      affiliate_commission_amount: '',
      affiliate_max_qualified_purchases_per_referred_user: '1',
      affiliate_attribution_window_days: '30',
      pickup_confirmation_hours: '24',
    },
  });

  useEffect(() => {
    if (!data?.config) {
      return;
    }

    form.reset({
      retainer_amount: data.config.retainer_amount,
      penalty_amount: data.config.penalty_amount,
      platform_fee_amount: data.config.platform_fee_amount,
      affiliate_commission_amount: data.config.affiliate_commission_amount,
      affiliate_max_qualified_purchases_per_referred_user: String(
        data.config.affiliate_max_qualified_purchases_per_referred_user,
      ),
      affiliate_attribution_window_days: String(data.config.affiliate_attribution_window_days),
      pickup_confirmation_hours: String(data.config.pickup_confirmation_hours),
    });
  }, [data?.config, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    await updateBusinessConfig({
      ...values,
      affiliate_max_qualified_purchases_per_referred_user: Number(
        values.affiliate_max_qualified_purchases_per_referred_user,
      ),
      affiliate_attribution_window_days: Number(values.affiliate_attribution_window_days),
      pickup_confirmation_hours: Number(values.pickup_confirmation_hours),
    }).unwrap();
  });

  return (
    <AdminPageScaffold
      title="Business Config"
      description="Manage the platform’s commercial defaults and operational guardrails with explicit save behavior and clear update metadata."
      actions={
        <SubmitButton
          type="button"
          text="Save Config"
          width="auto"
          loading={isSaving}
          onClick={onSubmit}
        />
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <AdminSectionCard
          title="Config Values"
          description="These values affect live platform flows, so changes should be deliberate and verified."
        >
          {isLoading ? (
            <p className="text-sm text-cv-gray-400">Loading current config...</p>
          ) : (
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={(event) => event.preventDefault()}
            >
              <div>
                <CvInput label="Retainer Amount" {...form.register('retainer_amount')} />
                {form.formState.errors.retainer_amount?.message ? (
                  <ErrorLabel text={form.formState.errors.retainer_amount.message} />
                ) : null}
              </div>
              <div>
                <CvInput label="Penalty Amount" {...form.register('penalty_amount')} />
                {form.formState.errors.penalty_amount?.message ? (
                  <ErrorLabel text={form.formState.errors.penalty_amount.message} />
                ) : null}
              </div>
              <div>
                <CvInput label="Platform Fee Amount" {...form.register('platform_fee_amount')} />
                {form.formState.errors.platform_fee_amount?.message ? (
                  <ErrorLabel text={form.formState.errors.platform_fee_amount.message} />
                ) : null}
              </div>
              <div>
                <CvInput
                  label="Affiliate Commission Amount"
                  {...form.register('affiliate_commission_amount')}
                />
                {form.formState.errors.affiliate_commission_amount?.message ? (
                  <ErrorLabel text={form.formState.errors.affiliate_commission_amount.message} />
                ) : null}
              </div>
              <div>
                <CvInput
                  label="Max Qualified Purchases"
                  type="number"
                  {...form.register('affiliate_max_qualified_purchases_per_referred_user')}
                />
                {form.formState.errors.affiliate_max_qualified_purchases_per_referred_user
                  ?.message ? (
                  <ErrorLabel
                    text={
                      form.formState.errors.affiliate_max_qualified_purchases_per_referred_user
                        .message
                    }
                  />
                ) : null}
              </div>
              <div>
                <CvInput
                  label="Attribution Window Days"
                  type="number"
                  {...form.register('affiliate_attribution_window_days')}
                />
                {form.formState.errors.affiliate_attribution_window_days?.message ? (
                  <ErrorLabel
                    text={form.formState.errors.affiliate_attribution_window_days.message}
                  />
                ) : null}
              </div>
              <div>
                <CvInput
                  label="Pickup Confirmation Hours"
                  type="number"
                  {...form.register('pickup_confirmation_hours')}
                />
                {form.formState.errors.pickup_confirmation_hours?.message ? (
                  <ErrorLabel text={form.formState.errors.pickup_confirmation_hours.message} />
                ) : null}
              </div>
            </form>
          )}
        </AdminSectionCard>

        <AdminSectionCard
          title="Update Metadata"
          description="Use this to confirm whether the current values have already been configured and who last touched them."
        >
          <div className="grid gap-3">
            <div className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
                Current State
              </p>
              <p className="mt-2 text-sm font-semibold text-cv-gray-900">
                {data?.config ? 'Configured' : 'Not configured yet'}
              </p>
            </div>
            <div className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
                Updated By
              </p>
              <p className="mt-2 text-sm font-semibold text-cv-gray-900">
                {data?.config?.updated_by_email || 'N/A'}
              </p>
            </div>
            <div className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
                Last Updated
              </p>
              <p className="mt-2 text-sm font-semibold text-cv-gray-900">
                {formatDate(data?.config?.updated_at)}
              </p>
            </div>
          </div>
        </AdminSectionCard>
      </div>
    </AdminPageScaffold>
  );
}
