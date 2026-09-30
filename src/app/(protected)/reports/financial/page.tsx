'use client';

import {
  AdminPageScaffold,
  AdminSectionCard,
  AdminStatCard,
} from '@/components/admin/AdminPageScaffold';
import { useGetSuperAdminFinancialReportQuery } from '@/features/super-admin/superAdminApi';
import { formatCurrency, formatDate } from '@/lib/format';

function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between border-b border-cv-gray-50 py-3 last:border-0">
      <span className="text-sm font-semibold text-cv-gray-400">{label}</span>
      <span className="text-sm font-bold text-cv-gray-900">{value}</span>
    </div>
  );
}

export default function FinancialReportsPage() {
  const { data, isLoading } = useGetSuperAdminFinancialReportQuery();

  return (
    <AdminPageScaffold
      title="Financial Reports"
      description="Review the minimum V1 financial summary across orders, retainers, escrow, penalties, and referral commission liability."
    >
      {isLoading || !data ? (
        <AdminSectionCard
          title="Loading Report"
          description="Financial summary data is being prepared."
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              label="Order Value"
              value={formatCurrency(data.orders.total_final_price)}
              helper={`${data.orders.total_count} total orders`}
            />
            <AdminStatCard
              label="Captured Retainers"
              value={formatCurrency(data.retainers.captured_amount)}
              helper={`${data.retainers.captured_count} successful payments`}
            />
            <AdminStatCard
              label="Escrow Held"
              value={formatCurrency(data.escrow.held_amount)}
              helper={`${data.escrow.held_count} held retainers`}
            />
            <AdminStatCard
              label="Referral Liability"
              value={formatCurrency(data.referrals.earned_amount)}
              helper={`${data.referrals.earned_count} earned commissions`}
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <AdminSectionCard
              title="Orders And Retainers"
              description={`Generated ${formatDate(data.generated_at)}.`}
            >
              <MetricRow label="Completed Orders" value={data.orders.completed_count} />
              <MetricRow
                label="Platform Fees"
                value={formatCurrency(data.orders.total_platform_fee)}
              />
              <MetricRow
                label="Retainers Captured"
                value={formatCurrency(data.retainers.captured_amount)}
              />
              <MetricRow
                label="Retainers Pending"
                value={formatCurrency(data.retainers.pending_amount)}
              />
              <MetricRow
                label="Retainers Failed"
                value={formatCurrency(data.retainers.failed_amount)}
              />
            </AdminSectionCard>

            <AdminSectionCard
              title="Escrow, Penalties, Referrals"
              description="Operational finance totals by current state."
            >
              <MetricRow label="Escrow Held" value={formatCurrency(data.escrow.held_amount)} />
              <MetricRow
                label="Escrow Released"
                value={formatCurrency(data.escrow.released_amount)}
              />
              <MetricRow
                label="Escrow Forfeited"
                value={formatCurrency(data.escrow.forfeited_amount)}
              />
              <MetricRow label="Penalties" value={formatCurrency(data.penalties.total_amount)} />
              <MetricRow
                label="Paid Referral Commissions"
                value={formatCurrency(data.referrals.paid_amount)}
              />
            </AdminSectionCard>
          </div>
        </div>
      )}
    </AdminPageScaffold>
  );
}
