'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ColumnDef } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { HiOutlineBanknotes, HiOutlineEye } from 'react-icons/hi2';

import { AdminActionMenu } from '@/components/admin/AdminActionMenu';
import { AdminCellStack, AdminDataTable } from '@/components/admin/AdminDataTable';
import { AdminDrawer } from '@/components/admin/AdminDrawer';
import { AdminKeyValueList } from '@/components/admin/AdminDetailsPanel';
import {
  AdminCompactFilterBar,
  AdminCompactSelect,
  AdminSearchToolbar,
} from '@/components/admin/AdminCompactFilters';
import { AdminPageScaffold } from '@/components/admin/AdminPageScaffold';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import CvInput from '@/components/ui/CvInput';
import CvModal from '@/components/ui/CvModal';
import SubmitButton from '@/components/ui/SubmitButton';
import {
  useGetSuperAdminReferralCommissionQuery,
  useGetSuperAdminReferralCommissionsQuery,
  useMarkSuperAdminReferralCommissionPaidMutation,
} from '@/features/super-admin/superAdminApi';
import { useAdminTableQueryForm } from '@/hooks/useAdminTableQueryForm';
import { downloadCsv } from '@/lib/downloadCsv';
import { formatCurrency, formatDate } from '@/lib/format';
import {
  superAdminReferralCommissionSchema,
  type SuperAdminReferralCommissionFormValues,
} from '@/schemas/super-admin-referral-commission.schema';
import type { ReferralCommissionItem } from '@/types/super-admin';

const commissionQueryDefaults = {
  search: '',
  status: '',
};

const commissionFilterKeys = ['status'] as const;

export default function ReferralCommissionsPage() {
  const [selectedCommissionId, setSelectedCommissionId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMarkPaidModalOpen, setIsMarkPaidModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const {
    form: queryForm,
    queryValues,
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
    defaultValues: commissionQueryDefaults,
    filterKeys: [...commissionFilterKeys],
  });
  const searchInput = queryForm.watch('search');

  const { data, isLoading, isFetching } = useGetSuperAdminReferralCommissionsQuery(queryParams);
  const { data: selectedCommission } = useGetSuperAdminReferralCommissionQuery(
    selectedCommissionId ?? '',
    { skip: !selectedCommissionId },
  );
  const [markPaid, { isLoading: isMarkingPaid }] =
    useMarkSuperAdminReferralCommissionPaidMutation();
  const form = useForm<SuperAdminReferralCommissionFormValues>({
    resolver: zodResolver(superAdminReferralCommissionSchema),
    defaultValues: {
      payout_reference: '',
    },
  });

  const columns = useMemo<ColumnDef<ReferralCommissionItem>[]>(
    () => [
      {
        accessorKey: 'referrer',
        header: 'Referrer',
        cell: ({ row }) => (
          <AdminCellStack
            title={row.original.referrer.full_name || row.original.referrer.email}
            subtitle={row.original.referrer.email}
          />
        ),
      },
      {
        accessorKey: 'referred_user',
        header: 'Referred User',
        cell: ({ row }) => (
          <AdminCellStack
            title={row.original.referred_user.full_name || row.original.referred_user.email}
            subtitle={row.original.referred_user.email}
          />
        ),
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => formatCurrency(row.original.amount),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <AdminStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'earned_at',
        header: 'Earned',
        cell: ({ row }) => formatDate(row.original.earned_at),
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
                  setSelectedCommissionId(row.original.id);
                  setIsDrawerOpen(true);
                },
              },
              ...(row.original.status === 'earned'
                ? [
                    {
                      label: 'Mark Paid',
                      icon: <HiOutlineBanknotes className="size-4" />,
                      onClick: () => {
                        setSelectedCommissionId(row.original.id);
                        form.reset({ payout_reference: '' });
                        setIsMarkPaidModalOpen(true);
                      },
                    },
                  ]
                : []),
            ]}
          />
        ),
      },
    ],
    [form],
  );

  const onSubmit = form.handleSubmit(async (values) => {
    if (!selectedCommissionId) {
      return;
    }

    await markPaid({
      id: selectedCommissionId,
      payout_reference: values.payout_reference,
    }).unwrap();

    setIsMarkPaidModalOpen(false);
  });

  async function handleExport() {
    setIsExporting(true);
    try {
      await downloadCsv({
        path: 'super-admin/referral-commissions/export/',
        filename: 'super-admin-referral-commissions.csv',
        params: queryValues,
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <AdminPageScaffold
      title="Commissions"
      description="Track earned versus paid referral liability and record payout references when commissions are settled."
      actions={
        <SubmitButton
          type="button"
          text={isExporting ? 'Exporting...' : 'Export CSV'}
          width="auto"
          loading={isExporting}
          onClick={handleExport}
        />
      }
    >
      <AdminSearchToolbar
        label="Search commissions"
        placeholder="Referrer, referred user, or order ID"
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
        <AdminCompactSelect label="Status" {...queryForm.register('status')}>
          <option value="">All statuses</option>
          <option value="earned">Earned</option>
          <option value="paid">Paid</option>
        </AdminCompactSelect>
      </AdminCompactFilterBar>

      <AdminDataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        totalCount={data?.count ?? 0}
        page={page}
        onPageChange={setPage}
        emptyTitle="No referral commissions found"
        emptyDescription="Try changing the current filters."
      />

      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Commission Detail"
        description="Review who earned the commission, which order triggered it, and whether payout has already been recorded."
        actions={
          selectedCommission?.status === 'earned' ? (
            <SubmitButton
              type="button"
              text="Mark Paid"
              width="auto"
              onClick={() => {
                form.reset({ payout_reference: '' });
                setIsMarkPaidModalOpen(true);
              }}
            />
          ) : null
        }
      >
        {selectedCommission ? (
          <AdminKeyValueList
            items={[
              {
                label: 'Referrer',
                value: selectedCommission.referrer.full_name || selectedCommission.referrer.email,
              },
              {
                label: 'Referred User',
                value:
                  selectedCommission.referred_user.full_name ||
                  selectedCommission.referred_user.email,
              },
              { label: 'Order ID', value: selectedCommission.order_id },
              { label: 'Amount', value: formatCurrency(selectedCommission.amount) },
              { label: 'Status', value: <AdminStatusBadge status={selectedCommission.status} /> },
              { label: 'Purchase Sequence', value: selectedCommission.purchase_sequence },
              { label: 'Earned At', value: formatDate(selectedCommission.earned_at) },
              { label: 'Paid At', value: formatDate(selectedCommission.paid_at) },
              { label: 'Payout Reference', value: selectedCommission.payout_reference || 'N/A' },
              { label: 'Paid By', value: selectedCommission.paid_by?.email || 'N/A' },
            ]}
          />
        ) : (
          <p className="text-sm text-cv-gray-400">
            Choose a commission record to inspect its payout state.
          </p>
        )}
      </AdminDrawer>

      <CvModal
        isOpen={isMarkPaidModalOpen}
        onClose={() => setIsMarkPaidModalOpen(false)}
        title="Mark Commission Paid"
      >
        <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
          <CvInput
            label="Payout Reference"
            placeholder="Optional provider or manual reference"
            {...form.register('payout_reference')}
          />
          <div className="flex justify-end">
            <SubmitButton
              type="button"
              text="Confirm Payout"
              width="auto"
              loading={isMarkingPaid}
              onClick={onSubmit}
            />
          </div>
        </form>
      </CvModal>
    </AdminPageScaffold>
  );
}
