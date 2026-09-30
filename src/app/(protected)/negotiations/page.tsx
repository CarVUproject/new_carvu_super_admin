'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import {
  AdminCompactFilterBar,
  AdminCompactSelect,
  AdminCompactTextInput,
  AdminSearchToolbar,
} from '@/components/admin/AdminCompactFilters';
import { AdminCellStack, AdminDataTable } from '@/components/admin/AdminDataTable';
import { AdminDrawer } from '@/components/admin/AdminDrawer';
import { AdminKeyValueList } from '@/components/admin/AdminDetailsPanel';
import { AdminPageScaffold, AdminSectionCard } from '@/components/admin/AdminPageScaffold';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import SubmitButton from '@/components/ui/SubmitButton';
import {
  useGetSuperAdminNegotiationQuery,
  useGetSuperAdminNegotiationsQuery,
} from '@/features/super-admin/superAdminApi';
import { useAdminTableQueryForm } from '@/hooks/useAdminTableQueryForm';
import { downloadCsv } from '@/lib/downloadCsv';
import { formatCurrency, formatDate, titleCase } from '@/lib/format';
import type { NegotiationDetail, NegotiationListItem } from '@/types/super-admin';

const negotiationQueryDefaults = {
  search: '',
  seller: '',
  buyer: '',
  status: '',
  source_type: '',
  vehicle_status: '',
  has_order: '',
  min_starting_price: '',
  max_starting_price: '',
};

const negotiationFilterKeys = [
  'seller',
  'buyer',
  'status',
  'source_type',
  'vehicle_status',
  'has_order',
  'min_starting_price',
  'max_starting_price',
] as const;

function userLabel(user: NegotiationListItem['buyer']) {
  return user.dealer_operating_name || user.full_name || user.email;
}

function CountPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-full border border-cv-gray-50 bg-cv-gray-10 px-2.5 py-1 text-xs font-semibold text-cv-gray-500">
      {label}: {value}
    </span>
  );
}

function NegotiationDetailDrawer({ negotiation }: { negotiation: NegotiationDetail }) {
  return (
    <div className="space-y-5">
      <AdminKeyValueList
        items={[
          { label: 'Status', value: <AdminStatusBadge status={negotiation.status} /> },
          { label: 'Source Type', value: titleCase(negotiation.source_type) },
          { label: 'Source ID', value: negotiation.source_id || 'N/A' },
          { label: 'Vehicle', value: negotiation.vehicle.title },
          { label: 'VIN', value: negotiation.vehicle.vin },
          { label: 'Seller', value: userLabel(negotiation.seller) },
          { label: 'Buyer', value: userLabel(negotiation.buyer) },
          { label: 'Starting Price', value: formatCurrency(negotiation.starting_price) },
          { label: 'Latest Offer', value: formatCurrency(negotiation.latest_offer_amount) },
          { label: 'Started At', value: formatDate(negotiation.started_at) },
          { label: 'Expires At', value: formatDate(negotiation.expires_at) },
          { label: 'Settled At', value: formatDate(negotiation.settled_at) },
        ]}
      />

      <AdminSectionCard
        title="Offer Timeline"
        description="Buyer and seller offer activity for this negotiation."
      >
        {negotiation.offers.length ? (
          <div className="grid gap-3">
            {negotiation.offers.map((offer) => (
              <div
                key={offer.id}
                className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <AdminCellStack
                    title={userLabel(offer.offered_by)}
                    subtitle={offer.offered_by.email}
                  />
                  <div className="text-right">
                    <p className="text-sm font-semibold text-cv-gray-900">
                      {formatCurrency(offer.amount)}
                    </p>
                    <p className="mt-1 text-xs text-cv-gray-400">{formatDate(offer.created_at)}</p>
                  </div>
                </div>
                {offer.comment ? (
                  <p className="mt-3 text-sm text-cv-gray-400">{offer.comment}</p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-cv-gray-400">No offers have been recorded.</p>
        )}
      </AdminSectionCard>

      <AdminSectionCard
        title="Agreement"
        description="Accepted offer details when this negotiation has settled."
      >
        {negotiation.agreement ? (
          <AdminKeyValueList
            items={[
              { label: 'Accepted By', value: userLabel(negotiation.agreement.accepted_by) },
              { label: 'Final Price', value: formatCurrency(negotiation.agreement.final_price) },
              { label: 'Accepted At', value: formatDate(negotiation.agreement.accepted_at) },
            ]}
          />
        ) : (
          <p className="text-sm text-cv-gray-400">No agreement has been accepted.</p>
        )}
      </AdminSectionCard>

      <AdminSectionCard
        title="Order Conversion"
        description="Orders created from this negotiation."
      >
        {negotiation.orders.length ? (
          <div className="grid gap-3">
            {negotiation.orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3"
              >
                <AdminCellStack
                  title={formatCurrency(order.final_price)}
                  subtitle={`${titleCase(order.status)} • ${formatDate(order.created_at)}`}
                />
                <AdminStatusBadge status={order.source_type} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-cv-gray-400">No order has been linked.</p>
        )}
      </AdminSectionCard>
    </div>
  );
}

export default function NegotiationsPage() {
  const [selectedNegotiationId, setSelectedNegotiationId] = useState<string | null>(null);
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
    defaultValues: negotiationQueryDefaults,
    filterKeys: [...negotiationFilterKeys],
  });
  const searchInput = form.watch('search');

  const { data, isLoading, isFetching } = useGetSuperAdminNegotiationsQuery(queryParams);
  const { data: selectedNegotiation, isLoading: isNegotiationLoading } =
    useGetSuperAdminNegotiationQuery(selectedNegotiationId ?? '', {
      skip: !selectedNegotiationId,
    });

  const columns = useMemo<ColumnDef<NegotiationListItem>[]>(
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
        accessorKey: 'seller',
        header: 'Seller',
        cell: ({ row }) => (
          <AdminCellStack
            title={userLabel(row.original.seller)}
            subtitle={row.original.seller.email}
          />
        ),
      },
      {
        accessorKey: 'buyer',
        header: 'Buyer',
        cell: ({ row }) => (
          <AdminCellStack
            title={userLabel(row.original.buyer)}
            subtitle={row.original.buyer.email}
          />
        ),
      },
      {
        accessorKey: 'starting_price',
        header: 'Pricing',
        cell: ({ row }) => (
          <AdminCellStack
            title={formatCurrency(row.original.latest_offer_amount)}
            subtitle={`Start ${formatCurrency(row.original.starting_price)}`}
          />
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <AdminStatusBadge status={row.original.status} />,
      },
      {
        id: 'activity',
        header: 'Activity',
        cell: ({ row }) => (
          <div className="flex min-w-[180px] flex-wrap gap-2">
            <CountPill label="Offers" value={row.original.offer_count} />
            <CountPill label="Orders" value={row.original.order_count} />
          </div>
        ),
      },
      {
        accessorKey: 'expires_at',
        header: 'Timing',
        cell: ({ row }) => (
          <AdminCellStack
            title={`Started ${formatDate(row.original.started_at)}`}
            subtitle={`Expires ${formatDate(row.original.expires_at)}`}
          />
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => {
              setSelectedNegotiationId(row.original.id);
              setIsDrawerOpen(true);
            }}
            className="rounded-xl border border-cv-gray-50 px-3 py-2 text-sm font-semibold text-cv-secondary-600 transition-colors hover:bg-cv-gray-10"
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
        path: 'super-admin/negotiations/export/',
        filename: 'super-admin-negotiations.csv',
        params: queryValues,
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <AdminPageScaffold
      title="Negotiations"
      description="Inspect offer-driven deal flows, participant context, offer timelines, and order conversion visibility."
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
        label="Search negotiations"
        placeholder="Vehicle, VIN, seller, or buyer"
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
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
          <option value="settled">Settled</option>
          <option value="expired">Expired</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Source" {...form.register('source_type')}>
          <option value="">Any source</option>
          <option value="hub_listing">Hub Listing</option>
          <option value="public_auction">Public Auction</option>
          <option value="wholesale_auction">Wholesale Auction</option>
          <option value="manual">Manual</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Order" {...form.register('has_order')}>
          <option value="">Any order</option>
          <option value="true">Has order</option>
          <option value="false">No order</option>
        </AdminCompactSelect>
        <AdminCompactTextInput
          label="Seller"
          placeholder="Seller name or email"
          {...form.register('seller')}
          className="w-[210px]"
        />
        <AdminCompactTextInput
          label="Buyer"
          placeholder="Buyer name or email"
          {...form.register('buyer')}
          className="w-[210px]"
        />
        <AdminCompactTextInput
          label="Vehicle Status"
          placeholder="listed, sold"
          {...form.register('vehicle_status')}
        />
        <AdminCompactTextInput
          label="Min Price"
          type="number"
          placeholder="0"
          {...form.register('min_starting_price')}
          className="w-[120px]"
        />
        <AdminCompactTextInput
          label="Max Price"
          type="number"
          placeholder="50000"
          {...form.register('max_starting_price')}
          className="w-[120px]"
        />
      </AdminCompactFilterBar>

      <AdminDataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        totalCount={data?.count ?? 0}
        page={page}
        onPageChange={setPage}
        emptyTitle="No negotiations found"
        emptyDescription="Try adjusting the current negotiation filters."
      />

      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Negotiation Detail"
        description="Review offer timeline, participants, source linkage, and order conversion."
      >
        {isNegotiationLoading ? (
          <p className="text-sm text-cv-gray-400">Loading negotiation detail...</p>
        ) : selectedNegotiation ? (
          <NegotiationDetailDrawer negotiation={selectedNegotiation} />
        ) : (
          <p className="text-sm text-cv-gray-400">
            Choose a negotiation to inspect its offer flow.
          </p>
        )}
      </AdminDrawer>
    </AdminPageScaffold>
  );
}
