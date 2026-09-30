'use client';

import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
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
import { AdminPageScaffold, AdminSectionCard } from '@/components/admin/AdminPageScaffold';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import SubmitButton from '@/components/ui/SubmitButton';
import {
  useGetSuperAdminVehicleQuery,
  useGetSuperAdminVehiclesQuery,
} from '@/features/super-admin/superAdminApi';
import { useAdminTableQueryForm } from '@/hooks/useAdminTableQueryForm';
import { downloadCsv } from '@/lib/downloadCsv';
import { formatCurrency, formatDate, titleCase } from '@/lib/format';
import type { VehicleAuctionSummary, VehicleDetail, VehicleListItem } from '@/types/super-admin';

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

function LinkedRecordList({
  title,
  emptyText,
  children,
}: {
  title: string;
  emptyText: string;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-cv-gray-400">{title}</h3>
      {children || <p className="text-sm text-cv-gray-400">{emptyText}</p>}
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

function VehicleDetailDrawer({ vehicle }: { vehicle: VehicleDetail }) {
  const allAuctions = [...vehicle.public_auctions, ...vehicle.wholesale_auctions];

  return (
    <div className="space-y-5">
      <AdminKeyValueList
        items={[
          { label: 'Vehicle', value: vehicle.title },
          { label: 'VIN', value: vehicle.vin },
          { label: 'Model', value: vehicle.model },
          { label: 'Year', value: vehicle.make_year },
          { label: 'Price', value: formatCurrency(vehicle.price) },
          { label: 'Condition', value: titleCase(vehicle.condition) },
          { label: 'Fuel Type', value: titleCase(vehicle.fuel_type) },
          { label: 'Transmission', value: titleCase(vehicle.transmission) },
          { label: 'Status', value: <StatusList statuses={vehicle.status} /> },
          {
            label: 'Owner',
            value: vehicle.owner
              ? vehicle.owner.dealer_operating_name ||
                vehicle.owner.full_name ||
                vehicle.owner.email
              : 'No owner',
          },
          {
            label: 'Owner Email',
            value: vehicle.owner?.email ?? 'N/A',
          },
          {
            label: 'Dealer Status',
            value: vehicle.owner?.dealer_status ? (
              <AdminStatusBadge status={vehicle.owner.dealer_status} />
            ) : (
              'N/A'
            ),
          },
          { label: 'Created At', value: formatDate(vehicle.created_at) },
        ]}
      />

      <AdminSectionCard
        title="Readiness"
        description="Operational signals used to understand whether the inventory record has enough context for downstream workflows."
      >
        <div className="flex flex-wrap gap-2">
          <AdminStatusBadge
            status={vehicle.readiness.has_details ? 'details ready' : 'details missing'}
          />
          <AdminStatusBadge
            status={vehicle.readiness.has_cover_image ? 'cover ready' : 'cover missing'}
          />
          <CountPill label="Images" value={vehicle.readiness.image_count} />
          <CountPill label="Features" value={vehicle.readiness.feature_count} />
          <CountPill label="Hub" value={vehicle.hub_listing_count} />
          <CountPill label="Auctions" value={allAuctions.length} />
          <CountPill label="Negotiations" value={vehicle.negotiation_count} />
          <CountPill label="Orders" value={vehicle.order_count} />
        </div>
      </AdminSectionCard>

      <LinkedRecordList title="Hub Listings" emptyText="No hub listings are linked.">
        {vehicle.hub_listings.length ? (
          <div className="grid gap-3">
            {vehicle.hub_listings.map((hub) => (
              <div
                key={hub.id}
                className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-cv-gray-900">
                      {formatCurrency(hub.price)}
                    </p>
                    <p className="mt-1 text-sm text-cv-gray-400">
                      Created {formatDate(hub.created_at)}
                    </p>
                  </div>
                  <AdminStatusBadge status={hub.available_for_sale ? 'available' : 'unavailable'} />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </LinkedRecordList>

      <LinkedRecordList title="Auctions" emptyText="No auctions are linked.">
        {allAuctions.length ? (
          <div className="grid gap-3">
            {allAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        ) : null}
      </LinkedRecordList>

      <LinkedRecordList title="Negotiations" emptyText="No negotiations are linked.">
        {vehicle.negotiations.length ? (
          <div className="grid gap-3">
            {vehicle.negotiations.map((negotiation) => (
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
                  {titleCase(negotiation.source_type)} • Offers: {negotiation.offer_count}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </LinkedRecordList>

      <LinkedRecordList title="Orders" emptyText="No orders are linked.">
        {vehicle.orders.length ? (
          <div className="grid gap-3">
            {vehicle.orders.map((order) => (
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
        ) : null}
      </LinkedRecordList>
    </div>
  );
}

const vehicleQueryDefaults = {
  search: '',
  seller: '',
  status: '',
  is_dealer: '',
  has_hub_listing: '',
  has_auction: '',
  has_order: '',
  has_details: '',
};

const vehicleFilterKeys = [
  'seller',
  'status',
  'is_dealer',
  'has_hub_listing',
  'has_auction',
  'has_order',
  'has_details',
] as const;

export default function VehiclesPage() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
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
    defaultValues: vehicleQueryDefaults,
    filterKeys: [...vehicleFilterKeys],
  });
  const searchInput = form.watch('search');

  const { data, isLoading, isFetching } = useGetSuperAdminVehiclesQuery(queryParams);
  const { data: selectedVehicle, isLoading: isVehicleLoading } = useGetSuperAdminVehicleQuery(
    selectedVehicleId ?? '',
    {
      skip: !selectedVehicleId,
    },
  );

  const columns = useMemo<ColumnDef<VehicleListItem>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Vehicle',
        cell: ({ row }) => (
          <div className="flex min-w-[260px] items-center gap-3">
            {row.original.cover_image ? (
              <div
                role="img"
                aria-label={row.original.title}
                className="size-14 rounded-2xl border border-cv-gray-50 object-cover"
                style={{
                  backgroundImage: `url(${row.original.cover_image})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
              />
            ) : (
              <div className="grid size-14 place-items-center rounded-2xl border border-cv-gray-50 bg-cv-gray-10 text-xs font-bold text-cv-gray-300">
                No image
              </div>
            )}
            <AdminCellStack
              title={row.original.title}
              subtitle={`${row.original.vin} • ${row.original.make_year} ${row.original.model}`}
            />
          </div>
        ),
      },
      {
        accessorKey: 'owner',
        header: 'Seller',
        cell: ({ row }) => (
          <AdminCellStack
            title={
              row.original.owner?.dealer_operating_name ||
              row.original.owner?.full_name ||
              row.original.owner?.email ||
              'No owner'
            }
            subtitle={row.original.owner?.email ?? 'N/A'}
          />
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => formatCurrency(row.original.price),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusList statuses={row.original.status} />,
      },
      {
        id: 'linked',
        header: 'Linked Records',
        cell: ({ row }) => (
          <div className="flex min-w-[260px] flex-wrap gap-2">
            <CountPill label="Hub" value={row.original.hub_listing_count} />
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
              setSelectedVehicleId(row.original.id);
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
        path: 'super-admin/vehicles/export/',
        filename: 'super-admin-vehicles.csv',
        params: queryValues,
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <AdminPageScaffold
      title="Vehicles"
      description="Inspect platform inventory, seller readiness, and linked listing, auction, negotiation, and order context."
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
        label="Search vehicles"
        placeholder="Title, model, year, VIN, or owner"
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
        <AdminCompactSelect label="Dealer Owner" {...form.register('is_dealer')}>
          <option value="">Any</option>
          <option value="true">Dealer owner</option>
          <option value="false">Non-dealer</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Details" {...form.register('has_details')}>
          <option value="">Any</option>
          <option value="true">Has details</option>
          <option value="false">Missing details</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Hub Listing" {...form.register('has_hub_listing')}>
          <option value="">Any</option>
          <option value="true">Has hub</option>
          <option value="false">No hub</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Auction" {...form.register('has_auction')}>
          <option value="">Any</option>
          <option value="true">Has auction</option>
          <option value="false">No auction</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Order" {...form.register('has_order')}>
          <option value="">Any</option>
          <option value="true">Has order</option>
          <option value="false">No order</option>
        </AdminCompactSelect>
        <AdminCompactTextInput
          label="Status Flag"
          placeholder="listed, sold"
          {...form.register('status')}
          className="w-[150px]"
        />
      </AdminCompactFilterBar>

      <AdminDataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        totalCount={data?.count ?? 0}
        page={page}
        onPageChange={setPage}
        emptyTitle="No vehicles found"
        emptyDescription="Try adjusting the current inventory filters."
      />

      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Vehicle Detail"
        description="Review seller readiness and linked marketplace, auction, negotiation, and order records."
      >
        {isVehicleLoading ? (
          <p className="text-sm text-cv-gray-400">Loading vehicle detail...</p>
        ) : selectedVehicle ? (
          <VehicleDetailDrawer vehicle={selectedVehicle} />
        ) : (
          <p className="text-sm text-cv-gray-400">
            Choose a vehicle to inspect its linked operational records.
          </p>
        )}
      </AdminDrawer>
    </AdminPageScaffold>
  );
}
