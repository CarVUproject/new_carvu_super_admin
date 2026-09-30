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
  useGetSuperAdminDealerSubscriptionQuery,
  useGetSuperAdminDealerSubscriptionsQuery,
  useRefreshSuperAdminDealerSubscriptionSnapshotMutation,
  useGetSuperAdminSubscriptionPlansQuery,
} from '@/features/super-admin/superAdminApi';
import { useAdminTableQueryForm } from '@/hooks/useAdminTableQueryForm';
import { downloadCsv } from '@/lib/downloadCsv';
import { formatCurrency, formatDate } from '@/lib/format';
import type { DealerSubscriptionItem } from '@/types/super-admin';

const dealerSubscriptionQueryDefaults = {
  search: '',
  status: '',
  plan: '',
};

const dealerSubscriptionFilterKeys = ['status', 'plan'] as const;

export default function DealerSubscriptionsPage() {
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);
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
    defaultValues: dealerSubscriptionQueryDefaults,
    filterKeys: [...dealerSubscriptionFilterKeys],
  });
  const searchInput = form.watch('search');

  const { data, isLoading, isFetching } = useGetSuperAdminDealerSubscriptionsQuery(queryParams);
  const { data: selectedSubscription } = useGetSuperAdminDealerSubscriptionQuery(
    selectedSubscriptionId ?? '',
    { skip: !selectedSubscriptionId },
  );
  const { data: plansData } = useGetSuperAdminSubscriptionPlansQuery(undefined);
  const [refreshSnapshot, { isLoading: isRefreshingSnapshot }] =
    useRefreshSuperAdminDealerSubscriptionSnapshotMutation();

  const columns = useMemo<ColumnDef<DealerSubscriptionItem>[]>(
    () => [
      {
        accessorKey: 'dealer_name',
        header: 'Dealer',
        cell: ({ row }) => (
          <AdminCellStack
            title={row.original.dealer_name}
            subtitle={row.original.user_full_name || row.original.user_email}
          />
        ),
      },
      {
        accessorKey: 'plan_name',
        header: 'Plan',
        cell: ({ row }) => (
          <AdminCellStack title={row.original.plan_name} subtitle={row.original.plan_code} />
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <AdminStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'current_period_end',
        header: 'Current Period End',
        cell: ({ row }) => formatDate(row.original.current_period_end),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => {
              setSelectedSubscriptionId(row.original.id);
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
        path: 'super-admin/dealer-subscriptions/export/',
        filename: 'super-admin-dealer-subscriptions.csv',
        params: queryValues,
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <AdminPageScaffold
      title="Dealer Subscriptions"
      description="Inspect which plan each dealer is on, whether billing is healthy, and how their current subscription period is progressing."
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
        label="Search subscriptions"
        placeholder="Dealer, user, or plan"
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
          <option value="active">Active</option>
          <option value="trialing">Trialing</option>
          <option value="incomplete">Incomplete</option>
          <option value="past_due">Past Due</option>
          <option value="unpaid">Unpaid</option>
          <option value="canceled">Canceled</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Plan" {...form.register('plan')}>
          <option value="">All plans</option>
          {(plansData?.results ?? []).map((planItem) => (
            <option key={planItem.id} value={planItem.code}>
              {planItem.name}
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
        emptyTitle="No dealer subscriptions found"
        emptyDescription="Try changing the current filters."
      />

      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Dealer Subscription Detail"
        description="Review the dealer, selected plan, Stripe references, and the current billing period."
        actions={
          selectedSubscription ? (
            <SubmitButton
              type="button"
              text={isRefreshingSnapshot ? 'Refreshing Snapshot...' : 'Refresh Snapshot'}
              width="auto"
              onClick={async () => {
                if (!selectedSubscriptionId) {
                  return;
                }

                const shouldRefresh = window.confirm(
                  'Refresh this subscription snapshot from the current live plan?',
                );
                if (!shouldRefresh) {
                  return;
                }

                await refreshSnapshot(selectedSubscriptionId);
              }}
            />
          ) : undefined
        }
      >
        {selectedSubscription ? (
          <div className="space-y-6">
            <AdminKeyValueList
              items={[
                { label: 'Dealer', value: selectedSubscription.dealer_name },
                { label: 'Dealer Status', value: selectedSubscription.dealer_status },
                { label: 'User', value: selectedSubscription.user_email },
                { label: 'Plan', value: selectedSubscription.plan_name },
                {
                  label: 'Status',
                  value: <AdminStatusBadge status={selectedSubscription.status} />,
                },
                {
                  label: 'Current Period Start',
                  value: formatDate(selectedSubscription.current_period_start),
                },
                {
                  label: 'Current Period End',
                  value: formatDate(selectedSubscription.current_period_end),
                },
                {
                  label: 'Cancel At Period End',
                  value: selectedSubscription.cancel_at_period_end ? 'Yes' : 'No',
                },
                {
                  label: 'Stripe Customer',
                  value: selectedSubscription.stripe_customer_id || 'N/A',
                },
                {
                  label: 'Stripe Subscription',
                  value: selectedSubscription.stripe_subscription_id || 'N/A',
                },
                {
                  label: 'Checkout Session',
                  value: selectedSubscription.stripe_checkout_session_id || 'N/A',
                },
              ]}
            />

            <section className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-cv-gray-900">Purchased Snapshot</h3>
                <p className="text-sm text-cv-gray-400">
                  This snapshot is the preserved plan state for this subscription.
                </p>
              </div>

              <AdminKeyValueList
                items={[
                  { label: 'Plan Code', value: selectedSubscription.plan_code },
                  {
                    label: 'Monthly Price',
                    value: selectedSubscription.snapshot_monthly_price
                      ? formatCurrency(selectedSubscription.snapshot_monthly_price)
                      : 'N/A',
                  },
                  {
                    label: 'Currency',
                    value: selectedSubscription.snapshot_currency?.toUpperCase() || 'N/A',
                  },
                  {
                    label: 'Snapshot Captured',
                    value: formatDate(selectedSubscription.snapshot_captured_at),
                  },
                  {
                    label: 'Required Permissions',
                    value:
                      selectedSubscription.snapshot_required_permission_codes.length > 0
                        ? selectedSubscription.snapshot_required_permission_codes.join(', ')
                        : 'None',
                  },
                  {
                    label: 'Features',
                    value:
                      selectedSubscription.snapshot_features.length > 0
                        ? selectedSubscription.snapshot_features.join(', ')
                        : 'None',
                  },
                ]}
              />
            </section>

            <section className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-cv-gray-900">Snapshot Entitlements</h3>
                <p className="text-sm text-cv-gray-400">
                  These limits remain tied to the subscription until an explicit refresh or
                  migration changes them.
                </p>
              </div>

              {selectedSubscription.snapshot_entitlements.length > 0 ? (
                <div className="grid gap-3">
                  {selectedSubscription.snapshot_entitlements.map((entitlement) => (
                    <div
                      key={entitlement.operation_code}
                      className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-cv-gray-900">
                            {entitlement.operation_name}
                          </p>
                          <p className="text-xs uppercase tracking-[0.12em] text-cv-gray-300">
                            {entitlement.operation_code}
                          </p>
                          <p className="text-sm leading-6 text-cv-gray-400">
                            {entitlement.operation_description || 'No description provided.'}
                          </p>
                        </div>
                        <AdminStatusBadge
                          status={entitlement.is_enabled ? 'enabled' : 'disabled'}
                        />
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
                            Count Strategy
                          </p>
                          <p className="mt-1 text-sm text-cv-gray-900">
                            {entitlement.is_counted
                              ? entitlement.usage_strategy.replaceAll('_', ' ')
                              : 'Not counted'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
                            Limit
                          </p>
                          <p className="mt-1 text-sm text-cv-gray-900">
                            {entitlement.is_enabled
                              ? entitlement.is_unlimited
                                ? 'Unlimited'
                                : (entitlement.limit_value ?? 'Missing')
                              : 'Disabled'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
                            Counted
                          </p>
                          <p className="mt-1 text-sm text-cv-gray-900">
                            {entitlement.is_counted ? 'Yes' : 'No'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-cv-gray-50 bg-cv-gray-10 px-4 py-4 text-sm text-cv-gray-400">
                  No entitlement snapshot has been captured for this subscription yet.
                </div>
              )}
            </section>
          </div>
        ) : (
          <p className="text-sm text-cv-gray-400">
            Choose a dealer subscription to inspect its billing state.
          </p>
        )}
      </AdminDrawer>
    </AdminPageScaffold>
  );
}
