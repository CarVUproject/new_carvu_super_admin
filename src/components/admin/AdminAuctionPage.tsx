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
import { useAdminTableQueryForm } from '@/hooks/useAdminTableQueryForm';
import { downloadCsv } from '@/lib/downloadCsv';
import { formatCurrency, formatDate, titleCase } from '@/lib/format';
import type {
  AuctionDetail,
  AuctionListItem,
  AuctionListQueryParams,
  PaginatedResponse,
} from '@/types/super-admin';

type AuctionQueryResult = {
  data?: PaginatedResponse<AuctionListItem>;
  isLoading: boolean;
  isFetching: boolean;
};

type AuctionDetailResult = {
  data?: AuctionDetail;
  isLoading: boolean;
};

type AdminAuctionPageProps = {
  title: string;
  description: string;
  searchLabel: string;
  searchPlaceholder: string;
  exportPath: string;
  exportFilename: string;
  emptyTitle: string;
  emptyDescription: string;
  useListQuery: (params: AuctionListQueryParams) => AuctionQueryResult;
  useDetailQuery: (id: string, options: { skip: boolean }) => AuctionDetailResult;
};

const auctionQueryDefaults = {
  search: '',
  seller: '',
  status: '',
  vehicle_status: '',
  has_winner: '',
  trade_in_vehicle: '',
  min_starting_value: '',
  max_starting_value: '',
};

const auctionFilterKeys = [
  'seller',
  'status',
  'vehicle_status',
  'has_winner',
  'trade_in_vehicle',
  'min_starting_value',
  'max_starting_value',
] as const;

function CountPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-full border border-cv-gray-50 bg-cv-gray-10 px-2.5 py-1 text-xs font-semibold text-cv-gray-500">
      {label}: {value}
    </span>
  );
}

function userLabel(user: AuctionListItem['created_by']) {
  return user?.dealer_operating_name || user?.full_name || user?.email || 'N/A';
}

function AuctionDetailDrawer({ auction }: { auction: AuctionDetail }) {
  return (
    <div className="space-y-5">
      <AdminKeyValueList
        items={[
          { label: 'Auction Type', value: titleCase(auction.auction_type) },
          { label: 'Status', value: <AdminStatusBadge status={auction.status} /> },
          { label: 'Vehicle', value: auction.vehicle.title },
          { label: 'VIN', value: auction.vehicle.vin },
          { label: 'Seller', value: userLabel(auction.created_by) },
          { label: 'Winner', value: userLabel(auction.winner) },
          { label: 'Starting Value', value: formatCurrency(auction.starting_value) },
          { label: 'Reserve Value', value: formatCurrency(auction.reserve_value) },
          { label: 'Highest Bid', value: formatCurrency(auction.highest_bid_amount) },
          { label: 'Bids', value: auction.bid_count },
          { label: 'Participants', value: auction.participant_count },
          { label: 'Starting At', value: formatDate(auction.starting_at) },
          { label: 'Ending At', value: formatDate(auction.ending_at) },
          { label: 'Trade-In Vehicle', value: auction.trade_in_vehicle ? 'Yes' : 'No' },
        ]}
      />

      <AdminSectionCard
        title="Bid Activity"
        description="Highest-value bids and participant context for this auction."
      >
        {auction.auction_bids.length ? (
          <div className="grid gap-3">
            {auction.auction_bids.map((bid) => (
              <div
                key={bid.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3"
              >
                <AdminCellStack title={userLabel(bid.user)} subtitle={bid.user.email} />
                <div className="text-right">
                  <p className="text-sm font-semibold text-cv-gray-900">
                    {formatCurrency(bid.amount)}
                  </p>
                  <p className="mt-1 text-xs text-cv-gray-400">{formatDate(bid.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-cv-gray-400">No bids have been placed.</p>
        )}
      </AdminSectionCard>

      <AdminSectionCard
        title="Location And Warranties"
        description="Attached auction address and warranty rows, when provided."
      >
        <div className="grid gap-4">
          {auction.auction_address ? (
            <AdminKeyValueList
              items={[
                { label: 'Country', value: auction.auction_address.country },
                { label: 'State', value: auction.auction_address.state },
                { label: 'City', value: auction.auction_address.city },
                { label: 'Street', value: auction.auction_address.street },
                { label: 'Postal Code', value: auction.auction_address.postal_code },
              ]}
            />
          ) : (
            <p className="text-sm text-cv-gray-400">No auction address is attached.</p>
          )}

          {auction.auction_warranties.length ? (
            <div className="flex flex-wrap gap-2">
              {auction.auction_warranties.map((warranty) => (
                <CountPill
                  key={warranty.id}
                  label={`${warranty.year}`}
                  value={Math.round(warranty.amount)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-cv-gray-400">No warranty rows are attached.</p>
          )}
        </div>
      </AdminSectionCard>

      <AdminSectionCard
        title="Outcomes"
        description="Downstream negotiation and order records linked to this auction."
      >
        <div className="flex flex-wrap gap-2">
          <CountPill label="Negotiations" value={auction.outcomes.negotiations.length} />
          <CountPill label="Orders" value={auction.outcomes.orders.length} />
        </div>
      </AdminSectionCard>
    </div>
  );
}

export function AdminAuctionPage({
  title,
  description,
  searchLabel,
  searchPlaceholder,
  exportPath,
  exportFilename,
  emptyTitle,
  emptyDescription,
  useListQuery,
  useDetailQuery,
}: AdminAuctionPageProps) {
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);
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
    defaultValues: auctionQueryDefaults,
    filterKeys: [...auctionFilterKeys],
  });
  const searchInput = form.watch('search');

  const { data, isLoading, isFetching } = useListQuery(queryParams);
  const { data: selectedAuction, isLoading: isAuctionLoading } = useDetailQuery(
    selectedAuctionId ?? '',
    { skip: !selectedAuctionId },
  );

  const columns = useMemo<ColumnDef<AuctionListItem>[]>(
    () => [
      {
        accessorKey: 'vehicle',
        header: 'Vehicle',
        cell: ({ row }) => (
          <AdminCellStack
            title={row.original.vehicle.title}
            subtitle={`${row.original.vehicle.vin} • ${row.original.vehicle.make_year} ${row.original.vehicle.model}`}
          />
        ),
      },
      {
        accessorKey: 'created_by',
        header: 'Seller',
        cell: ({ row }) => (
          <AdminCellStack
            title={userLabel(row.original.created_by)}
            subtitle={row.original.created_by?.email ?? 'N/A'}
          />
        ),
      },
      {
        accessorKey: 'starting_value',
        header: 'Values',
        cell: ({ row }) => (
          <AdminCellStack
            title={formatCurrency(row.original.starting_value)}
            subtitle={`Reserve ${formatCurrency(row.original.reserve_value)}`}
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
          <div className="flex min-w-[220px] flex-wrap gap-2">
            <CountPill label="Bids" value={row.original.bid_count} />
            <CountPill label="Participants" value={row.original.participant_count} />
          </div>
        ),
      },
      {
        accessorKey: 'ending_at',
        header: 'Timing',
        cell: ({ row }) => (
          <AdminCellStack
            title={`Starts ${formatDate(row.original.starting_at)}`}
            subtitle={`Ends ${formatDate(row.original.ending_at)}`}
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
              setSelectedAuctionId(row.original.id);
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
        path: exportPath,
        filename: exportFilename,
        params: queryValues,
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <AdminPageScaffold
      title={title}
      description={description}
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
        label={searchLabel}
        placeholder={searchPlaceholder}
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
        <AdminCompactTextInput
          label="Seller"
          placeholder="Dealer, owner, email"
          {...form.register('seller')}
          className="w-[220px]"
        />
        <AdminCompactSelect label="Status" {...form.register('status')}>
          <option value="">Any status</option>
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="ended">Ended</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Winner" {...form.register('has_winner')}>
          <option value="">Any winner</option>
          <option value="true">Has winner</option>
          <option value="false">No winner</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Trade-In" {...form.register('trade_in_vehicle')}>
          <option value="">Any trade-in</option>
          <option value="true">Trade-in</option>
          <option value="false">No trade-in</option>
        </AdminCompactSelect>
        <AdminCompactTextInput
          label="Vehicle Status"
          placeholder="listed, sold"
          {...form.register('vehicle_status')}
        />
        <AdminCompactTextInput
          label="Min Start"
          type="number"
          placeholder="0"
          {...form.register('min_starting_value')}
          className="w-[120px]"
        />
        <AdminCompactTextInput
          label="Max Start"
          type="number"
          placeholder="50000"
          {...form.register('max_starting_value')}
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
        emptyTitle={emptyTitle}
        emptyDescription={emptyDescription}
      />

      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={`${title} Detail`}
        description="Review timing, bid activity, participants, linked vehicle, and outcome context."
      >
        {isAuctionLoading ? (
          <p className="text-sm text-cv-gray-400">Loading auction detail...</p>
        ) : selectedAuction ? (
          <AuctionDetailDrawer auction={selectedAuction} />
        ) : (
          <p className="text-sm text-cv-gray-400">
            Choose an auction to inspect its operational context.
          </p>
        )}
      </AdminDrawer>
    </AdminPageScaffold>
  );
}
