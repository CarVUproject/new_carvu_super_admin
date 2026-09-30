'use client';

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { AdminCellStack, AdminDataTable } from '@/components/admin/AdminDataTable';
import { AdminCompactFilterBar, AdminCompactSelect } from '@/components/admin/AdminCompactFilters';
import { AdminPageScaffold } from '@/components/admin/AdminPageScaffold';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { useGetSuperAdminAuditLogsQuery } from '@/features/super-admin/superAdminApi';
import { useAdminTableQueryForm } from '@/hooks/useAdminTableQueryForm';
import { formatDate, titleCase } from '@/lib/format';
import type { AuditLogItem } from '@/types/super-admin';

const AUDIT_ACTIONS = [
  'dealer_approved',
  'dealer_rejected',
  'business_config_updated',
  'user_updated',
  'referral_commission_marked_paid',
  'subscription_snapshot_refreshed',
  'retainer_failed',
  'csv_exported',
];

const auditLogQueryDefaults = {
  action: '',
};

const auditLogFilterKeys = ['action'] as const;

function formatMetadata(metadata: Record<string, unknown>) {
  const keys = Object.keys(metadata);

  if (!keys.length) {
    return 'No metadata';
  }

  return keys
    .slice(0, 3)
    .map((key) => `${titleCase(key)}: ${String(metadata[key])}`)
    .join(' | ');
}

export default function AuditLogsPage() {
  const { form, queryParams, page, setPage, activeFilterCount, applyFilters, resetFilters } =
    useAdminTableQueryForm({
      defaultValues: auditLogQueryDefaults,
      filterKeys: [...auditLogFilterKeys],
    });
  const { data, isLoading, isFetching } = useGetSuperAdminAuditLogsQuery({
    page: queryParams.page,
    action: queryParams.action,
  });

  const columns = useMemo<ColumnDef<AuditLogItem>[]>(
    () => [
      {
        accessorKey: 'action',
        header: 'Action',
        cell: ({ row }) => <AdminStatusBadge status={row.original.action} />,
      },
      {
        accessorKey: 'actor',
        header: 'Actor',
        cell: ({ row }) => (
          <AdminCellStack
            title={row.original.actor.full_name || row.original.actor.email}
            subtitle={row.original.actor.email}
          />
        ),
      },
      {
        accessorKey: 'target_type',
        header: 'Target',
        cell: ({ row }) => (
          <AdminCellStack title={row.original.target_type} subtitle={row.original.target_id} />
        ),
      },
      {
        accessorKey: 'metadata',
        header: 'Metadata',
        cell: ({ row }) => (
          <span className="line-clamp-2 text-sm text-cv-gray-400">
            {formatMetadata(row.original.metadata)}
          </span>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'Timestamp',
        cell: ({ row }) => (
          <span className="font-semibold text-cv-gray-900">
            {formatDate(row.original.created_at)}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <AdminPageScaffold
      title="Audit Logs"
      description="Review the minimum V1 accountability trail for sensitive super admin actions."
    >
      <AdminCompactFilterBar
        onApply={applyFilters}
        onReset={resetFilters}
        isApplying={isFetching}
        activeCount={activeFilterCount}
      >
        <AdminCompactSelect label="Action" {...form.register('action')}>
          <option value="">All actions</option>
          {AUDIT_ACTIONS.map((auditAction) => (
            <option key={auditAction} value={auditAction}>
              {titleCase(auditAction)}
            </option>
          ))}
        </AdminCompactSelect>
      </AdminCompactFilterBar>

      <AdminDataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        totalCount={data?.count ?? 0}
        page={page}
        onPageChange={setPage}
        emptyTitle="No audit logs found"
        emptyDescription="Sensitive super admin actions will appear here after they are performed."
      />
    </AdminPageScaffold>
  );
}
