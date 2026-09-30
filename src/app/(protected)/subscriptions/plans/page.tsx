'use client';

import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ColumnDef } from '@tanstack/react-table';
import { Controller, useForm } from 'react-hook-form';
import { HiOutlineEye, HiOutlinePencilSquare, HiOutlinePlus } from 'react-icons/hi2';

import { AdminActionMenu } from '@/components/admin/AdminActionMenu';
import { AdminCellStack, AdminDataTable } from '@/components/admin/AdminDataTable';
import { AdminDrawer } from '@/components/admin/AdminDrawer';
import { AdminKeyValueList } from '@/components/admin/AdminDetailsPanel';
import { AdminMultiSelect } from '@/components/admin/AdminMultiSelect';
import { AdminPageScaffold } from '@/components/admin/AdminPageScaffold';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import CvInput from '@/components/ui/CvInput';
import CvModal from '@/components/ui/CvModal';
import ErrorLabel from '@/components/ui/ErrorLabel';
import SubmitButton from '@/components/ui/SubmitButton';
import {
  useCreateSuperAdminSubscriptionPlanMutation,
  useGetSuperAdminModulesQuery,
  useGetSuperAdminSubscriptionPlanQuery,
  useGetSuperAdminSubscriptionPlansQuery,
  useGetSuperAdminSubscriptionPoliciesQuery,
  useUpdateSuperAdminSubscriptionPlanMutation,
} from '@/features/super-admin/superAdminApi';
import { formatCurrency, titleCase } from '@/lib/format';
import {
  superAdminSubscriptionPlanSchema,
  type SuperAdminSubscriptionPlanFormValues,
} from '@/schemas/super-admin-subscription-plan.schema';
import type { SubscriptionPlanItem } from '@/types/super-admin';

type PlanModalMode = 'create' | 'edit';

export default function SubscriptionPlansPage() {
  const [page, setPage] = useState(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<PlanModalMode>('create');

  const { data, isLoading } = useGetSuperAdminSubscriptionPlansQuery({ page });
  const { data: selectedPlan } = useGetSuperAdminSubscriptionPlanQuery(selectedPlanId ?? '', {
    skip: !selectedPlanId,
  });
  const { data: policiesData } = useGetSuperAdminSubscriptionPoliciesQuery(undefined);
  const { data: modulesData } = useGetSuperAdminModulesQuery(undefined);
  const [createPlan, { isLoading: isCreatingPlan }] = useCreateSuperAdminSubscriptionPlanMutation();
  const [updatePlan, { isLoading: isUpdatingPlan }] = useUpdateSuperAdminSubscriptionPlanMutation();

  const operationCatalog = policiesData?.results ?? [];
  const form = useForm<SuperAdminSubscriptionPlanFormValues>({
    resolver: zodResolver(superAdminSubscriptionPlanSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      monthly_price: '',
      currency: 'usd',
      stripe_price_id: '',
      required_permission_codes: [],
      features: '',
      display_order: 0,
      is_featured: false,
      is_active: true,
      entitlements: [],
    },
  });

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    if (modalMode === 'edit' && selectedPlan) {
      form.reset({
        code: selectedPlan.code,
        name: selectedPlan.name,
        description: selectedPlan.description,
        monthly_price: selectedPlan.monthly_price,
        currency: selectedPlan.currency,
        stripe_price_id: selectedPlan.stripe_price_id,
        required_permission_codes: selectedPlan.required_permission_codes,
        features: selectedPlan.features.join(', '),
        display_order: selectedPlan.display_order,
        is_featured: selectedPlan.is_featured,
        is_active: selectedPlan.is_active,
        entitlements: operationCatalog.map((operation) => {
          const matchingEntitlement = selectedPlan.entitlements.find(
            (entitlement) => entitlement.operation_code === operation.operation_code,
          );

          return {
            operation: operation.operation_code,
            is_enabled: matchingEntitlement?.is_enabled ?? false,
            limit_value: matchingEntitlement?.limit_value ?? null,
            is_unlimited: matchingEntitlement?.is_unlimited ?? false,
          };
        }),
      });

      return;
    }

    form.reset({
      code: '',
      name: '',
      description: '',
      monthly_price: '',
      currency: 'usd',
      stripe_price_id: '',
      required_permission_codes: [],
      features: '',
      display_order: 0,
      is_featured: false,
      is_active: true,
      entitlements: operationCatalog.map((operation) => ({
        operation: operation.operation_code,
        is_enabled: false,
        limit_value: null,
        is_unlimited: false,
      })),
    });
  }, [form, isModalOpen, modalMode, operationCatalog, selectedPlan]);

  const entitlements = form.watch('entitlements');
  const permissionOptions = useMemo(
    () =>
      (modulesData?.results ?? []).flatMap((module) =>
        module.permissions.map((permission) => ({
          value: permission.code,
          label: `${permission.module}: ${permission.name}`,
        })),
      ),
    [modulesData?.results],
  );

  const columns = useMemo<ColumnDef<SubscriptionPlanItem>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Plan',
        cell: ({ row }) => (
          <AdminCellStack
            title={row.original.name}
            subtitle={`${row.original.code} • ${row.original.entitlements.length} entitlements`}
          />
        ),
      },
      {
        accessorKey: 'monthly_price',
        header: 'Price',
        cell: ({ row }) => formatCurrency(row.original.monthly_price),
      },
      {
        accessorKey: 'is_featured',
        header: 'Featured',
        cell: ({ row }) => (
          <AdminStatusBadge status={row.original.is_featured ? 'featured' : 'standard'} />
        ),
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => (
          <AdminStatusBadge status={row.original.is_active ? 'active' : 'inactive'} />
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <AdminActionMenu
            items={[
              {
                label: 'View',
                icon: <HiOutlineEye className="size-4" />,
                onClick: () => {
                  setSelectedPlanId(row.original.id);
                  setIsDrawerOpen(true);
                },
              },
              {
                label: 'Edit',
                icon: <HiOutlinePencilSquare className="size-4" />,
                onClick: () => {
                  setSelectedPlanId(row.original.id);
                  setModalMode('edit');
                  setIsModalOpen(true);
                },
              },
            ]}
          />
        ),
      },
    ],
    [],
  );

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = {
      code: values.code,
      name: values.name,
      description: values.description,
      monthly_price: values.monthly_price,
      currency: values.currency,
      stripe_price_id: values.stripe_price_id,
      required_permission_codes: values.required_permission_codes,
      features: values.features
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      display_order: Number(values.display_order),
      is_featured: values.is_featured,
      is_active: values.is_active,
      entitlements: values.entitlements.map((entitlement) => ({
        operation: entitlement.operation,
        is_enabled: entitlement.is_enabled,
        limit_value:
          entitlement.is_enabled && !entitlement.is_unlimited ? entitlement.limit_value : null,
        is_unlimited: entitlement.is_enabled ? entitlement.is_unlimited : false,
      })),
    };

    if (modalMode === 'create') {
      const createdPlan = await createPlan(payload).unwrap();
      setSelectedPlanId(createdPlan.id);
      setIsDrawerOpen(true);
    } else if (selectedPlanId) {
      await updatePlan({ id: selectedPlanId, body: payload }).unwrap();
    }

    setIsModalOpen(false);
  });

  return (
    <AdminPageScaffold
      title="Plans"
      description="Manage subscription packages, pricing, Stripe linkage, and operation entitlements from a single admin workflow."
      actions={
        <SubmitButton
          type="button"
          text="Create Plan"
          width="auto"
          onClick={() => {
            setModalMode('create');
            setIsModalOpen(true);
          }}
          icon={<HiOutlinePlus className="size-4" />}
        />
      }
    >
      <AdminDataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        totalCount={data?.count ?? 0}
        page={page}
        onPageChange={setPage}
        emptyTitle="No subscription plans found"
        emptyDescription="Create the first plan to manage dealer access commercially."
      />

      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Plan Detail"
        description="Inspect plan pricing, active state, and operation entitlements."
        actions={
          selectedPlan ? (
            <SubmitButton
              type="button"
              text="Edit Plan"
              width="auto"
              onClick={() => {
                setModalMode('edit');
                setIsModalOpen(true);
              }}
            />
          ) : null
        }
      >
        {selectedPlan ? (
          <div className="space-y-5">
            <AdminKeyValueList
              items={[
                { label: 'Code', value: selectedPlan.code },
                { label: 'Price', value: formatCurrency(selectedPlan.monthly_price) },
                {
                  label: 'Status',
                  value: (
                    <AdminStatusBadge status={selectedPlan.is_active ? 'active' : 'inactive'} />
                  ),
                },
                {
                  label: 'Featured',
                  value: (
                    <AdminStatusBadge status={selectedPlan.is_featured ? 'featured' : 'standard'} />
                  ),
                },
                { label: 'Stripe Price ID', value: selectedPlan.stripe_price_id || 'N/A' },
              ]}
            />

            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-cv-gray-400">
                Features
              </h3>
              {selectedPlan.features.length ? (
                <div className="flex flex-wrap gap-2">
                  {selectedPlan.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-cv-gray-50 bg-cv-gray-10 px-3 py-1 text-xs font-semibold text-cv-gray-500"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-cv-gray-400">No feature labels configured.</p>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-cv-gray-400">
                Entitlements
              </h3>
              <div className="grid gap-3">
                {selectedPlan.entitlements.map((entitlement) => (
                  <div
                    key={entitlement.operation_code}
                    className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4"
                  >
                    <p className="text-sm font-semibold text-cv-gray-900">
                      {entitlement.operation_name}
                    </p>
                    <p className="mt-1 text-sm text-cv-gray-400">
                      {entitlement.operation_description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <AdminStatusBadge status={entitlement.is_enabled ? 'enabled' : 'disabled'} />
                      <span className="rounded-full border border-cv-gray-50 bg-white px-3 py-1 text-xs font-semibold text-cv-gray-500">
                        {entitlement.is_unlimited
                          ? 'Unlimited'
                          : (entitlement.limit_value ?? 'No limit')}
                      </span>
                      <span className="rounded-full border border-cv-gray-50 bg-white px-3 py-1 text-xs font-semibold text-cv-gray-500">
                        {titleCase(entitlement.usage_strategy)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-cv-gray-400">
            Choose a subscription plan to inspect its entitlements.
          </p>
        )}
      </AdminDrawer>

      <CvModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Create Plan' : 'Edit Plan'}
        size="xl"
      >
        <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <CvInput label="Plan Code" {...form.register('code')} />
              {form.formState.errors.code?.message ? (
                <ErrorLabel text={form.formState.errors.code.message} />
              ) : null}
            </div>
            <div>
              <CvInput label="Plan Name" {...form.register('name')} />
              {form.formState.errors.name?.message ? (
                <ErrorLabel text={form.formState.errors.name.message} />
              ) : null}
            </div>
            <div>
              <CvInput label="Monthly Price" {...form.register('monthly_price')} />
              {form.formState.errors.monthly_price?.message ? (
                <ErrorLabel text={form.formState.errors.monthly_price.message} />
              ) : null}
            </div>
            <div>
              <CvInput label="Currency" {...form.register('currency')} />
              {form.formState.errors.currency?.message ? (
                <ErrorLabel text={form.formState.errors.currency.message} />
              ) : null}
            </div>
            <div>
              <CvInput label="Stripe Price ID" {...form.register('stripe_price_id')} />
            </div>
            <div>
              <CvInput
                label="Display Order"
                type="number"
                {...form.register('display_order', { valueAsNumber: true })}
              />
              {form.formState.errors.display_order?.message ? (
                <ErrorLabel text={form.formState.errors.display_order.message} />
              ) : null}
            </div>
          </div>

          <div>
            <CvInput label="Description" {...form.register('description')} />
          </div>
          <div>
            <CvInput
              label="Feature Labels"
              placeholder="Comma separated"
              {...form.register('features')}
            />
          </div>
          <div>
            <Controller
              control={form.control}
              name="required_permission_codes"
              render={({ field }) => (
                <AdminMultiSelect
                  label="Required Permissions"
                  placeholder="Search and select permissions"
                  options={permissionOptions}
                  value={permissionOptions.filter((option) => field.value.includes(option.value))}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3">
              <input
                type="checkbox"
                checked={form.watch('is_featured')}
                onChange={(event) => form.setValue('is_featured', event.target.checked)}
                className="size-4 rounded border-cv-gray-50"
              />
              <span className="text-sm font-semibold text-cv-gray-900">Featured plan</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3">
              <input
                type="checkbox"
                checked={form.watch('is_active')}
                onChange={(event) => form.setValue('is_active', event.target.checked)}
                className="size-4 rounded border-cv-gray-50"
              />
              <span className="text-sm font-semibold text-cv-gray-900">Plan is active</span>
            </label>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-cv-gray-500">Entitlements</p>
              <p className="text-sm text-cv-gray-400">
                Enable operations and define usage limits for this plan.
              </p>
            </div>

            <div className="grid gap-3">
              {operationCatalog.map((operation, index) => {
                const entitlement = entitlements[index];

                return (
                  <div
                    key={operation.id}
                    className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-cv-gray-900">
                          {operation.operation_name}
                        </p>
                        <p className="text-sm text-cv-gray-400">
                          {operation.operation_description}
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
                        <label className="flex items-center gap-3 rounded-2xl border border-cv-gray-50 bg-white px-4 py-3">
                          <input
                            type="checkbox"
                            checked={entitlement?.is_enabled ?? false}
                            onChange={(event) =>
                              form.setValue(
                                `entitlements.${index}.is_enabled`,
                                event.target.checked,
                              )
                            }
                            className="size-4 rounded border-cv-gray-50"
                          />
                          <span className="text-sm font-semibold text-cv-gray-900">Enabled</span>
                        </label>
                        <label className="flex items-center gap-3 rounded-2xl border border-cv-gray-50 bg-white px-4 py-3">
                          <input
                            type="checkbox"
                            checked={entitlement?.is_unlimited ?? false}
                            onChange={(event) =>
                              form.setValue(
                                `entitlements.${index}.is_unlimited`,
                                event.target.checked,
                              )
                            }
                            className="size-4 rounded border-cv-gray-50"
                          />
                          <span className="text-sm font-semibold text-cv-gray-900">Unlimited</span>
                        </label>
                        <CvInput
                          label="Limit"
                          type="number"
                          value={entitlement?.limit_value ?? ''}
                          onChange={(event) =>
                            form.setValue(
                              `entitlements.${index}.limit_value`,
                              event.target.value ? Number(event.target.value) : null,
                            )
                          }
                          disabled={
                            !operation.is_counted ||
                            !(entitlement?.is_enabled ?? false) ||
                            (entitlement?.is_unlimited ?? false)
                          }
                        />
                        <div className="rounded-2xl border border-cv-gray-50 bg-white px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
                            Strategy
                          </p>
                          <p className="mt-2 text-sm font-semibold text-cv-gray-900">
                            {titleCase(operation.usage_strategy)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <SubmitButton
              type="button"
              text={modalMode === 'create' ? 'Create Plan' : 'Save Changes'}
              width="auto"
              loading={isCreatingPlan || isUpdatingPlan}
              onClick={onSubmit}
            />
          </div>
        </form>
      </CvModal>
    </AdminPageScaffold>
  );
}
