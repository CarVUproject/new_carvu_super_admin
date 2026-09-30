'use client';

import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ColumnDef } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { HiOutlineEye, HiOutlinePencilSquare } from 'react-icons/hi2';

import { AdminActionMenu } from '@/components/admin/AdminActionMenu';
import { AdminCellStack, AdminDataTable } from '@/components/admin/AdminDataTable';
import { AdminDrawer } from '@/components/admin/AdminDrawer';
import { AdminKeyValueList } from '@/components/admin/AdminDetailsPanel';
import { AdminPageScaffold } from '@/components/admin/AdminPageScaffold';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import CvModal from '@/components/ui/CvModal';
import SubmitButton from '@/components/ui/SubmitButton';
import {
  useGetSuperAdminSubscriptionPoliciesQuery,
  useGetSuperAdminSubscriptionPolicyQuery,
  useUpdateSuperAdminSubscriptionPolicyMutation,
} from '@/features/super-admin/superAdminApi';
import { titleCase } from '@/lib/format';
import {
  superAdminSubscriptionPolicySchema,
  type SuperAdminSubscriptionPolicyFormValues,
} from '@/schemas/super-admin-subscription-policy.schema';
import type { SubscriptionPolicyItem } from '@/types/super-admin';

export default function SubscriptionPoliciesPage() {
  const [page, setPage] = useState(1);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useGetSuperAdminSubscriptionPoliciesQuery({ page });
  const { data: selectedPolicy } = useGetSuperAdminSubscriptionPolicyQuery(selectedPolicyId ?? '', {
    skip: !selectedPolicyId,
  });
  const [updatePolicy, { isLoading: isSaving }] = useUpdateSuperAdminSubscriptionPolicyMutation();
  const form = useForm<SuperAdminSubscriptionPolicyFormValues>({
    resolver: zodResolver(superAdminSubscriptionPolicySchema),
    defaultValues: {
      subscription_required: false,
      is_active: true,
    },
  });

  useEffect(() => {
    if (!selectedPolicy || !isModalOpen) {
      return;
    }

    form.reset({
      subscription_required: selectedPolicy.subscription_required,
      is_active: selectedPolicy.is_active,
    });
  }, [form, isModalOpen, selectedPolicy]);

  const columns = useMemo<ColumnDef<SubscriptionPolicyItem>[]>(
    () => [
      {
        accessorKey: 'operation_name',
        header: 'Operation',
        cell: ({ row }) => (
          <AdminCellStack
            title={row.original.operation_name}
            subtitle={row.original.operation_code}
          />
        ),
      },
      {
        accessorKey: 'usage_strategy',
        header: 'Usage Strategy',
        cell: ({ row }) => titleCase(row.original.usage_strategy),
      },
      {
        accessorKey: 'subscription_required',
        header: 'Subscription Required',
        cell: ({ row }) => (
          <AdminStatusBadge status={row.original.subscription_required ? 'required' : 'optional'} />
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
                  setSelectedPolicyId(row.original.id);
                  setIsDrawerOpen(true);
                },
              },
              {
                label: 'Edit',
                icon: <HiOutlinePencilSquare className="size-4" />,
                onClick: () => {
                  setSelectedPolicyId(row.original.id);
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
    if (!selectedPolicyId) {
      return;
    }

    await updatePolicy({
      id: selectedPolicyId,
      body: values,
    }).unwrap();

    setIsModalOpen(false);
  });

  return (
    <AdminPageScaffold
      title="Policies"
      description="Review operation access rules and control whether a subscription is required for each system capability."
    >
      <AdminDataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        totalCount={data?.count ?? 0}
        page={page}
        onPageChange={setPage}
        emptyTitle="No policies found"
        emptyDescription="Subscription policies will appear here when operation definitions are configured."
      />

      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Policy Detail"
        description="Inspect how this operation is governed and whether it is active on the platform."
        actions={
          selectedPolicy ? (
            <SubmitButton
              type="button"
              text="Edit Policy"
              width="auto"
              onClick={() => setIsModalOpen(true)}
            />
          ) : null
        }
      >
        {selectedPolicy ? (
          <AdminKeyValueList
            items={[
              { label: 'Operation', value: selectedPolicy.operation_name },
              { label: 'Code', value: selectedPolicy.operation_code },
              { label: 'Description', value: selectedPolicy.operation_description },
              { label: 'Strategy', value: titleCase(selectedPolicy.usage_strategy) },
              {
                label: 'Subscription Required',
                value: (
                  <AdminStatusBadge
                    status={selectedPolicy.subscription_required ? 'required' : 'optional'}
                  />
                ),
              },
              {
                label: 'Status',
                value: (
                  <AdminStatusBadge status={selectedPolicy.is_active ? 'active' : 'inactive'} />
                ),
              },
            ]}
          />
        ) : (
          <p className="text-sm text-cv-gray-400">
            Choose a policy from the table to inspect its current state.
          </p>
        )}
      </AdminDrawer>

      <CvModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Policy">
        <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
          <label className="flex items-center gap-3 rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3">
            <input
              type="checkbox"
              checked={form.watch('subscription_required')}
              onChange={(event) => form.setValue('subscription_required', event.target.checked)}
              className="size-4 rounded border-cv-gray-50"
            />
            <span className="text-sm font-semibold text-cv-gray-900">Subscription is required</span>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3">
            <input
              type="checkbox"
              checked={form.watch('is_active')}
              onChange={(event) => form.setValue('is_active', event.target.checked)}
              className="size-4 rounded border-cv-gray-50"
            />
            <span className="text-sm font-semibold text-cv-gray-900">Policy is active</span>
          </label>

          <div className="flex justify-end">
            <SubmitButton
              type="button"
              text="Save Changes"
              width="auto"
              loading={isSaving}
              onClick={onSubmit}
            />
          </div>
        </form>
      </CvModal>
    </AdminPageScaffold>
  );
}
