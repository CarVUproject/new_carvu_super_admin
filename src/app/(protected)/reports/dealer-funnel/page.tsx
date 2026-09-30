'use client';

import {
  AdminPageScaffold,
  AdminSectionCard,
  AdminStatCard,
} from '@/components/admin/AdminPageScaffold';
import { useGetSuperAdminDealerFunnelReportQuery } from '@/features/super-admin/superAdminApi';
import { formatDate } from '@/lib/format';

function FunnelRow({ label, count, rate }: { label: string; count: number; rate?: number }) {
  return (
    <div className="grid gap-3 border-b border-cv-gray-50 py-4 last:border-0 sm:grid-cols-[1fr_120px_120px] sm:items-center">
      <span className="text-sm font-semibold text-cv-gray-900">{label}</span>
      <span className="text-sm font-bold text-cv-gray-900">{count}</span>
      <span className="text-sm font-semibold text-cv-gray-400">
        {rate === undefined ? 'Baseline' : `${rate}%`}
      </span>
    </div>
  );
}

export default function DealerFunnelPage() {
  const { data, isLoading } = useGetSuperAdminDealerFunnelReportQuery();

  return (
    <AdminPageScaffold
      title="Dealer Funnel"
      description="Track the V1 dealer lifecycle from registration through approval, subscription activation, listing activity, and completed order progression."
    >
      {isLoading || !data ? (
        <AdminSectionCard
          title="Loading Funnel"
          description="Dealer funnel data is being prepared."
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              label="Registered Dealers"
              value={String(data.totals.registered)}
              helper={`${data.totals.pending} pending review`}
            />
            <AdminStatCard
              label="Approved"
              value={String(data.totals.approved)}
              helper={`${data.rates.approval_rate}% approval rate`}
            />
            <AdminStatCard
              label="Active Subscriptions"
              value={String(data.totals.with_active_subscription)}
              helper={`${data.rates.active_subscription_rate}% of registered dealers`}
            />
            <AdminStatCard
              label="Completed Orders"
              value={String(data.totals.with_completed_order)}
              helper={`${data.rates.completed_order_rate}% of registered dealers`}
            />
          </div>

          <AdminSectionCard
            title="Lifecycle Progression"
            description={`Generated ${formatDate(data.generated_at)}.`}
          >
            <FunnelRow label="Registered" count={data.totals.registered} />
            <FunnelRow
              label="Approved"
              count={data.totals.approved}
              rate={data.rates.approval_rate}
            />
            <FunnelRow
              label="Active Subscription"
              count={data.totals.with_active_subscription}
              rate={data.rates.active_subscription_rate}
            />
            <FunnelRow
              label="Vehicle Created"
              count={data.totals.with_vehicle}
              rate={data.rates.vehicle_listing_rate}
            />
            <FunnelRow
              label="Hub Listing"
              count={data.totals.with_hub_listing}
              rate={data.rates.hub_listing_rate}
            />
            <FunnelRow
              label="Completed Seller Order"
              count={data.totals.with_completed_order}
              rate={data.rates.completed_order_rate}
            />
          </AdminSectionCard>
        </div>
      )}
    </AdminPageScaffold>
  );
}
