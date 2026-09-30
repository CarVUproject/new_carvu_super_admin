'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

import { AdminCellStack, AdminDataTable } from '@/components/admin/AdminDataTable';
import {
  AdminCompactFilterBar,
  AdminCompactSelect,
  AdminCompactTextInput,
  AdminSearchToolbar,
} from '@/components/admin/AdminCompactFilters';
import { AdminDrawer } from '@/components/admin/AdminDrawer';
import { AdminKeyValueList } from '@/components/admin/AdminDetailsPanel';
import { AdminPageScaffold } from '@/components/admin/AdminPageScaffold';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import SubmitButton from '@/components/ui/SubmitButton';
import {
  useGetSuperAdminHubListingQuery,
  useGetSuperAdminHubListingsQuery,
} from '@/features/super-admin/superAdminApi';
import { useAdminTableQueryForm } from '@/hooks/useAdminTableQueryForm';
import { downloadCsv } from '@/lib/downloadCsv';
import { formatCurrency, formatDate, titleCase } from '@/lib/format';
import type {
  HubListingDetail,
  HubListingListItem,
  VehicleAuctionSummary,
} from '@/types/super-admin';

function CountPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-full border border-cv-gray-50 bg-cv-gray-10 px-2.5 py-1 text-xs font-semibold text-cv-gray-500">
      {label}: {value}
    </span>
  );
}

function StatusList({ statuses }: { statuses: string[] }) {
  if (!statuses.length) {
    return <span className="text-sm text-cv-gray-400">No status flags</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((status) => (
        <AdminStatusBadge key={status} status={status} />
      ))}
    </div>
  );
}

function AuctionCard({ auction }: { auction: VehicleAuctionSummary }) {
  return (
    <div className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-cv-gray-900">
            {titleCase(auction.auction_type)} Auction
          </p>
          <p className="mt-1 text-sm text-cv-gray-400">
            {formatDate(auction.starting_at)} to {formatDate(auction.ending_at)}
          </p>
        </div>
        <CountPill label="Bids" value={auction.bid_count} />
      </div>
      <div className="mt-3 grid gap-2 text-sm text-cv-gray-500 sm:grid-cols-2">
        <span>Start: {formatCurrency(auction.starting_value)}</span>
        <span>Reserve: {formatCurrency(auction.reserve_value)}</span>
      </div>
    </div>
  );
}

function HubListingDetailDrawer({ listing }: { listing: HubListingDetail }) {
  const allAuctions = [...listing.public_auctions, ...listing.wholesale_auctions];

  return (
    <div className="space-y-5">
      <AdminKeyValueList
        items={[
          { label: 'Listing Price', value: formatCurrency(listing.price) },
          {
            label: 'Availability',
            value: (
              <AdminStatusBadge status={listing.available_for_sale ? 'available' : 'unavailable'} />
            ),
          },
          { label: 'Vehicle', value: listing.vehicle.title },
          { label: 'VIN', value: listing.vehicle.vin },
          { label: 'Model', value: listing.vehicle.model },
          { label: 'Year', value: listing.vehicle.make_year },
          { label: 'Vehicle Price', value: formatCurrency(listing.vehicle.price) },
          { label: 'Vehicle Status', value: <StatusList statuses={listing.vehicle.status} /> },
          {
            label: 'Seller',
            value: listing.vehicle.owner
              ? listing.vehicle.owner.dealer_operating_name ||
                listing.vehicle.owner.full_name ||
                listing.vehicle.owner.email
              : 'No owner',
          },
          { label: 'Seller Email', value: listing.vehicle.owner?.email ?? 'N/A' },
          {
            label: 'Dealer Status',
            value: listing.vehicle.owner?.dealer_status ? (
              <AdminStatusBadge status={listing.vehicle.owner.dealer_status} />
            ) : (
              'N/A'
            ),
          },
          { label: 'Created At', value: formatDate(listing.created_at) },
          { label: 'Updated At', value: formatDate(listing.updated_at) },
        ]}
      />

      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-cv-gray-400">
          Linked Auctions
        </h3>
        {allAuctions.length ? (
          <div className="grid gap-3">
            {allAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-cv-gray-400">No auctions are linked.</p>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-cv-gray-400">
          Negotiations
        </h3>
        {listing.negotiations.length ? (
          <div className="grid gap-3">
            {listing.negotiations.map((negotiation) => (
              <div
                key={negotiation.id}
                className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-cv-gray-900">
                      {formatCurrency(negotiation.starting_price)}
                    </p>
                    <p className="mt-1 text-sm text-cv-gray-400">
                      {negotiation.buyer.full_name || negotiation.buyer.email} and{' '}
                      {negotiation.seller.full_name || negotiation.seller.email}
                    </p>
                  </div>
                  <AdminStatusBadge status={negotiation.status} />
                </div>
                <p className="mt-3 text-sm text-cv-gray-400">
                  Offers: {negotiation.offer_count} • Expires {formatDate(negotiation.expires_at)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-cv-gray-400">No negotiations are linked.</p>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-cv-gray-400">Orders</h3>
        {listing.orders.length ? (
          <div className="grid gap-3">
            {listing.orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-cv-gray-900">
                      {formatCurrency(order.final_price)}
                    </p>
                    <p className="mt-1 text-sm text-cv-gray-400">
                      {order.buyer.full_name || order.buyer.email}
                    </p>
                  </div>
                  <AdminStatusBadge status={order.status} />
                </div>
                <p className="mt-3 text-sm text-cv-gray-400">
                  {titleCase(order.source_type)} • Created {formatDate(order.created_at)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-cv-gray-400">No orders are linked.</p>
        )}
      </div>
    </div>
  );
}

const hubListingQueryDefaults = {
  search: '',
  seller: '',
  available_for_sale: '',
  vehicle_status: '',
  min_price: '',
  max_price: '',
  has_auction: '',
  has_negotiation: '',
  has_order: '',
};

const hubListingFilterKeys = [
  'seller',
  'available_for_sale',
  'vehicle_status',
  'min_price',
  'max_price',
  'has_auction',
  'has_negotiation',
  'has_order',
] as const;

export default function HubListingsPage() {
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
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
    defaultValues: hubListingQueryDefaults,
    filterKeys: [...hubListingFilterKeys],
  });
  const searchInput = form.watch('search');

  const { data, isLoading, isFetching } = useGetSuperAdminHubListingsQuery(queryParams);
  const { data: selectedListing, isLoading: isListingLoading } = useGetSuperAdminHubListingQuery(
    selectedListingId ?? '',
    {
      skip: !selectedListingId,
    },
  );

  const columns = useMemo<ColumnDef<HubListingListItem>[]>(
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
        accessorKey: 'vehicle.owner',
        header: 'Seller',
        cell: ({ row }) => (
          <AdminCellStack
            title={
              row.original.vehicle.owner?.dealer_operating_name ||
              row.original.vehicle.owner?.full_name ||
              row.original.vehicle.owner?.email ||
              'No owner'
            }
            subtitle={row.original.vehicle.owner?.email ?? 'N/A'}
          />
        ),
      },
      {
        accessorKey: 'price',
        header: 'Listing Price',
        cell: ({ row }) => formatCurrency(row.original.price),
      },
      {
        accessorKey: 'available_for_sale',
        header: 'Availability',
        cell: ({ row }) => (
          <AdminStatusBadge
            status={row.original.available_for_sale ? 'available' : 'unavailable'}
          />
        ),
      },
      {
        id: 'linked',
        header: 'Linked Records',
        cell: ({ row }) => (
          <div className="flex min-w-[240px] flex-wrap gap-2">
            <CountPill
              label="Auctions"
              value={row.original.public_auction_count + row.original.wholesale_auction_count}
            />
            <CountPill label="Negotiations" value={row.original.negotiation_count} />
            <CountPill label="Orders" value={row.original.order_count} />
          </div>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => {
              setSelectedListingId(row.original.id);
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
        path: 'super-admin/hub-listings/export/',
        filename: 'super-admin-hub-listings.csv',
        params: queryValues,
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <AdminPageScaffold
      title="Hub Listings"
      description="Inspect public marketplace listing health, seller context, availability, price, and linked downstream records."
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
        label="Search listings"
        placeholder="Vehicle, VIN, year, model, or owner"
        value={searchInput}
        onChange={(value) => setField('search', value)}
        onSearch={applySearch}
        onClear={clearSearch}
        hasSearch={hasSearch}
        isSearching={isFetching}
      />

      <AdminCompactFilterBar
        onApply={applyFilters}
        onReset={resetFilters}
        activeCount={activeFilterCount}
        isApplying={isFetching}
      >
        <AdminCompactTextInput
          label="Seller"
          placeholder="Dealer, owner, email"
          {...form.register('seller')}
          className="w-[220px]"
        />
        <AdminCompactSelect label="Availability" {...form.register('available_for_sale')}>
          <option value="">Any</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </AdminCompactSelect>
        <AdminCompactTextInput
          label="Vehicle Status"
          placeholder="listed, sold"
          {...form.register('vehicle_status')}
        />
        <AdminCompactTextInput
          label="Min Price"
          type="number"
          placeholder="0"
          {...form.register('min_price')}
          className="w-[120px]"
        />
        <AdminCompactTextInput
          label="Max Price"
          type="number"
          placeholder="50000"
          {...form.register('max_price')}
          className="w-[120px]"
        />
        <AdminCompactSelect label="Auction" {...form.register('has_auction')}>
          <option value="">Any</option>
          <option value="true">Has auction</option>
          <option value="false">No auction</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Negotiation" {...form.register('has_negotiation')}>
          <option value="">Any</option>
          <option value="true">Has negotiation</option>
          <option value="false">No negotiation</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Order" {...form.register('has_order')}>
          <option value="">Any</option>
          <option value="true">Has order</option>
          <option value="false">No order</option>
        </AdminCompactSelect>
      </AdminCompactFilterBar>

      <AdminDataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        totalCount={data?.count ?? 0}
        page={page}
        onPageChange={setPage}
        emptyTitle="No hub listings found"
        emptyDescription="Try adjusting the current marketplace filters."
      />

      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Hub Listing Detail"
        description="Review listing availability, seller context, vehicle status, and linked transaction records."
      >
        {isListingLoading ? (
          <p className="text-sm text-cv-gray-400">Loading hub listing detail...</p>
        ) : selectedListing ? (
          <HubListingDetailDrawer listing={selectedListing} />
        ) : (
          <p className="text-sm text-cv-gray-400">
            Choose a hub listing to inspect its linked operational records.
          </p>
        )}
      </AdminDrawer>
    </AdminPageScaffold>
  );
}
