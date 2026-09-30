'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

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
import SubmitButton from '@/components/ui/SubmitButton';
import {
  useGetSuperAdminOrderQuery,
  useGetSuperAdminOrdersQuery,
} from '@/features/super-admin/superAdminApi';
import { useAdminTableQueryForm } from '@/hooks/useAdminTableQueryForm';
import { downloadCsv } from '@/lib/downloadCsv';
import { formatCurrency, formatDate, titleCase } from '@/lib/format';
import type { OrderListItem } from '@/types/super-admin';

const orderQueryDefaults = {
  search: '',
  status: '',
  source_type: '',
};

const orderFilterKeys = ['status', 'source_type'] as const;

export default function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const {
    form,
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
    defaultValues: orderQueryDefaults,
    filterKeys: [...orderFilterKeys],
  });
  const searchInput = form.watch('search');

  const { data, isLoading, isFetching } = useGetSuperAdminOrdersQuery(queryParams);
  const { data: selectedOrder } = useGetSuperAdminOrderQuery(selectedOrderId ?? '', {
    skip: !selectedOrderId,
  });

  const columns = useMemo<ColumnDef<OrderListItem>[]>(
    () => [
      {
        accessorKey: 'vehicle',
        header: 'Vehicle',
        cell: ({ row }) => (
          <AdminCellStack
            title={row.original.vehicle.title}
            subtitle={`${row.original.vehicle.vin} • ${titleCase(row.original.source_type)}`}
          />
        ),
      },
      {
        accessorKey: 'buyer',
        header: 'Buyer',
        cell: ({ row }) => (
          <AdminCellStack
            title={row.original.buyer.full_name || row.original.buyer.email}
            subtitle={row.original.buyer.email}
          />
        ),
      },
      {
        accessorKey: 'seller',
        header: 'Seller',
        cell: ({ row }) => (
          <AdminCellStack
            title={row.original.seller.full_name || row.original.seller.email}
            subtitle={row.original.seller.email}
          />
        ),
      },
      {
        accessorKey: 'final_price',
        header: 'Final Price',
        cell: ({ row }) => formatCurrency(row.original.final_price),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <AdminStatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => {
              setSelectedOrderId(row.original.id);
              setIsDrawerOpen(true);
            }}
            className="rounded-xl border border-cv-gray-50 px-3 py-2 text-sm font-semibold text-cv-primary-500 transition-colors hover:bg-cv-gray-10"
          >
            View
          </button>
        ),
      },
    ],
    [],
  );

  async function handleExport() {
    setIsExporting(true);
    try {
      await downloadCsv({
        path: 'super-admin/orders/export/',
        filename: 'super-admin-orders.csv',
        params: queryValues,
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <AdminPageScaffold
      title="Orders"
      description="Inspect transaction health, participant context, release-form linkage, retainer payment state, and applied penalties."
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
        label="Search orders"
        placeholder="Vehicle, VIN, buyer, or seller"
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
        <AdminCompactSelect label="Status" {...form.register('status')}>
          <option value="">All statuses</option>
          <option value="retainer_captured">Retainer Captured</option>
          <option value="payment_failed">Payment Failed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="cancelled_seller_fault">Cancelled Seller Fault</option>
          <option value="cancelled_buyer_no_show">Cancelled Buyer No-Show</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Source" {...form.register('source_type')}>
          <option value="">All sources</option>
          <option value="manual">Manual</option>
          <option value="hub_listing">Hub Listing</option>
          <option value="public_auction">Public Auction</option>
          <option value="wholesale_auction">Wholesale Auction</option>
        </AdminCompactSelect>
      </AdminCompactFilterBar>

      <AdminDataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        totalCount={data?.count ?? 0}
        page={page}
        onPageChange={setPage}
        emptyTitle="No orders found"
        emptyDescription="Try adjusting the current filters."
      />

      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Order Detail"
        description="Review pricing, deadlines, release form state, retainer payment state, and penalties from one place."
      >
        {selectedOrder ? (
          <div className="space-y-5">
            <AdminKeyValueList
              items={[
                { label: 'Vehicle', value: selectedOrder.vehicle.title },
                { label: 'VIN', value: selectedOrder.vehicle.vin },
                {
                  label: 'Buyer',
                  value: selectedOrder.buyer.full_name || selectedOrder.buyer.email,
                },
                {
                  label: 'Seller',
                  value: selectedOrder.seller.full_name || selectedOrder.seller.email,
                },
                { label: 'Source Type', value: titleCase(selectedOrder.source_type) },
                { label: 'Status', value: <AdminStatusBadge status={selectedOrder.status} /> },
                { label: 'Final Price', value: formatCurrency(selectedOrder.final_price) },
                { label: 'Retainer Amount', value: formatCurrency(selectedOrder.retainer_amount) },
                { label: 'Platform Fee', value: formatCurrency(selectedOrder.platform_fee_amount) },
                {
                  label: 'Completion Deadline',
                  value: formatDate(selectedOrder.completion_deadline_at),
                },
              ]}
            />

            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-cv-gray-400">
                Release Form
              </h3>
              {selectedOrder.release_form ? (
                <AdminKeyValueList
                  items={[
                    { label: 'Verification ID', value: selectedOrder.release_form.verification_id },
                    {
                      label: 'Status',
                      value: <AdminStatusBadge status={selectedOrder.release_form.status} />,
                    },
                    { label: 'Viewed At', value: formatDate(selectedOrder.release_form.viewed_at) },
                    { label: 'Used At', value: formatDate(selectedOrder.release_form.used_at) },
                  ]}
                />
              ) : (
                <p className="text-sm text-cv-gray-400">No release form is linked yet.</p>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-cv-gray-400">
                Retainer Payment
              </h3>
              {selectedOrder.retainer_payment ? (
                <AdminKeyValueList
                  items={[
                    {
                      label: 'Status',
                      value: <AdminStatusBadge status={selectedOrder.retainer_payment.status} />,
                    },
                    {
                      label: 'Amount',
                      value: formatCurrency(selectedOrder.retainer_payment.amount),
                    },
                    {
                      label: 'Payment Intent',
                      value: selectedOrder.retainer_payment.payment_intent_id || 'N/A',
                    },
                    {
                      label: 'Failure Reason',
                      value: selectedOrder.retainer_payment.failure_reason || 'N/A',
                    },
                  ]}
                />
              ) : (
                <p className="text-sm text-cv-gray-400">No retainer payment is linked yet.</p>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-cv-gray-400">
                Penalties
              </h3>
              {selectedOrder.penalties.length ? (
                <div className="grid gap-3">
                  {selectedOrder.penalties.map((penalty, index) => (
                    <div
                      key={`${penalty.reason}-${index}`}
                      className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4"
                    >
                      <p className="text-sm font-semibold text-cv-gray-900">
                        {formatCurrency(penalty.amount)}
                      </p>
                      <p className="mt-1 text-sm text-cv-gray-400">
                        {titleCase(penalty.reason)} • {formatDate(penalty.applied_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-cv-gray-400">No penalties have been applied.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-cv-gray-400">
            Choose an order to inspect its linked transaction records.
          </p>
        )}
      </AdminDrawer>
    </AdminPageScaffold>
  );
}
