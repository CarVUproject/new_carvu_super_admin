'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { AdminCellStack, AdminDataTable } from '@/components/admin/AdminDataTable';
import {
  AdminCompactFilterBar,
  AdminCompactSelect,
  AdminSearchToolbar,
} from '@/components/admin/AdminCompactFilters';
import { AdminPageScaffold } from '@/components/admin/AdminPageScaffold';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { useGetSuperAdminArbitrationCasesQuery } from '@/features/super-admin/superAdminApi';
import { useAdminTableQueryForm } from '@/hooks/useAdminTableQueryForm';
import { formatCurrency, formatDate, titleCase } from '@/lib/format';
import type { ArbitrationCaseSummary } from '@/types/arbitration';

const arbitrationQueryDefaults = {
  search: '',
  status: '',
  status_group: '',
  severity: '',
  overdue: '',
};

const arbitrationFilterKeys = ['status', 'status_group', 'severity', 'overdue'] as const;

export default function ArbitrationPage() {
  const {
    form,
    queryParams,
    page,
    setPage,
    activeFilterCount,
    hasSearch,
    setField,
    applySearch,
    clearSearch,
    applyFilters,
    resetFilters,
  } = useAdminTableQueryForm({
    defaultValues: arbitrationQueryDefaults,
    filterKeys: [...arbitrationFilterKeys],
  });
  const searchInput = form.watch('search');

  const { data, isLoading, isFetching } = useGetSuperAdminArbitrationCasesQuery(queryParams);

  const columns = useMemo<ColumnDef<ArbitrationCaseSummary>[]>(
    () => [
      {
        accessorKey: 'case_number',
        header: 'Case',
        cell: ({ row }) => (
          <AdminCellStack
            title={row.original.case_number}
            subtitle={`Order ${row.original.order}`}
          />
        ),
      },
      {
        accessorKey: 'parties',
        header: 'Parties',
        cell: ({ row }) => (
          <AdminCellStack
            title={`Buyer ${row.original.buyer}`}
            subtitle={`Seller ${row.original.seller}`}
          />
        ),
      },
      {
        accessorKey: 'reason',
        header: 'Reason',
        cell: ({ row }) => (
          <AdminCellStack
            title={titleCase(row.original.reason)}
            subtitle={titleCase(row.original.severity)}
          />
        ),
      },
      {
        accessorKey: 'claimed_amount',
        header: 'Claimed',
        cell: ({ row }) => formatCurrency(row.original.claimed_amount),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <AdminStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'updated_at',
        header: 'Updated',
        cell: ({ row }) => formatDate(row.original.updated_at),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Link
            href={`/arbitration/${row.original.id}`}
            className="rounded-xl border border-cv-gray-50 px-3 py-2 text-sm font-semibold text-cv-primary-500 transition-colors hover:bg-cv-gray-10"
          >
            Review
          </Link>
        ),
      },
    ],
    [],
  );

  return (
    <AdminPageScaffold
      title="Arbitration"
      description="Review buyer and seller disputes, evidence, inspection requests, deadlines, and admin handling from the marketplace queue."
    >
      <AdminSearchToolbar
        label="Search arbitration"
        placeholder="Case number, order, VIN, buyer, or seller"
        value={searchInput}
        onChange={(value) => setField('search', value)}
        onSearch={applySearch}
        onClear={clearSearch}
        isSearching={isFetching}
        hasSearch={hasSearch}
      />

      <AdminCompactFilterBar
        onApply={applyFilters}
        onReset={resetFilters}
        isApplying={isFetching}
        activeCount={activeFilterCount}
      >
        <AdminCompactSelect label="Queue" {...form.register('status_group')}>
          <option value="">All queues</option>
          <option value="needs_action">Needs action</option>
          <option value="active">Active</option>
          <option value="resolved">Resolved</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Status" {...form.register('status')}>
          <option value="">All statuses</option>
          <option value="awaiting_seller_response">Awaiting seller response</option>
          <option value="awaiting_buyer_response">Awaiting buyer response</option>
          <option value="under_admin_review">Admin review</option>
          <option value="inspection_requested">Inspection requested</option>
          <option value="inspection_pending_external">Inspection pending external</option>
          <option value="awaiting_compliance">Awaiting compliance</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Severity" {...form.register('severity')}>
          <option value="">All severities</option>
          <option value="cosmetic">Cosmetic</option>
          <option value="functional">Functional</option>
          <option value="safety_critical">Safety critical</option>
          <option value="documentation">Documentation</option>
          <option value="high_value">High value</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Deadline" {...form.register('overdue')}>
          <option value="">Any deadline</option>
          <option value="1">Overdue only</option>
        </AdminCompactSelect>
      </AdminCompactFilterBar>

      <AdminDataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        totalCount={data?.count ?? 0}
        page={page}
        onPageChange={setPage}
        emptyTitle="No arbitration cases found"
        emptyDescription="Try adjusting the queue, status, severity, or search filters."
      />
    </AdminPageScaffold>
  );
}
