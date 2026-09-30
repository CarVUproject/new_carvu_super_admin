'use client';

import Link from 'next/link';
import {
  HiOutlineArrowTrendingUp,
  HiOutlineBuildingOffice2,
  HiOutlineCheckBadge,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
  HiOutlineUsers,
} from 'react-icons/hi2';

import {
  AdminPageScaffold,
  AdminSectionCard,
  AdminStatCard,
} from '@/components/admin/AdminPageScaffold';
import { useGetSuperAdminDashboardQuery } from '@/features/super-admin/superAdminApi';
import { formatCurrency } from '@/lib/format';

const quickLinks = [
  {
    href: '/dealers',
    title: 'Dealer Review',
    description: 'Approve or reject newly registered dealers and inspect their documents.',
    icon: HiOutlineBuildingOffice2,
  },
  {
    href: '/users',
    title: 'Users',
    description: 'Review platform users, linked roles, and account health.',
    icon: HiOutlineUsers,
  },
  {
    href: '/access/roles',
    title: 'Access Control',
    description: 'Manage roles, modules, and the permission structure used across the app.',
    icon: HiOutlineShieldCheck,
  },
  {
    href: '/settings/business-config',
    title: 'Business Config',
    description: 'Update retainer, fee, affiliate, and pickup confirmation platform settings.',
    icon: HiOutlineCreditCard,
  },
];

export default function DashboardPage() {
  const { data, isLoading } = useGetSuperAdminDashboardQuery();

  return (
    <AdminPageScaffold
      title="Dashboard"
      description="Track the platform’s core operational health across users, dealers, subscriptions, orders, retainers, escrow, and referral liability."
    >
      <div className="grid gap-4 lg:grid-cols-4">
        <AdminStatCard
          label="Pending Dealers"
          value={isLoading ? '...' : String(data?.dealers.pending ?? 0)}
          helper="New dealer registrations waiting for approval."
        />
        <AdminStatCard
          label="Active Subscriptions"
          value={isLoading ? '...' : String(data?.subscriptions.active ?? 0)}
          helper="Dealers currently on active or trialing subscription states."
        />
        <AdminStatCard
          label="Retainer Failures"
          value={isLoading ? '...' : String(data?.retainers.failed ?? 0)}
          helper="Retainer payments that need operator attention."
        />
        <AdminStatCard
          label="Earned Referral Liability"
          value={isLoading ? '...' : formatCurrency(data?.referrals.earned_amount)}
          helper="Referral commissions earned but not necessarily paid out yet."
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <AdminSectionCard
          title="Operational Snapshot"
          description="These cards cover the highest-signal numbers the super admin should see first."
        >
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[18px] border border-cv-gray-50 bg-cv-gray-10 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-cv-gray-400">Users</p>
                  <p className="mt-3 text-2xl font-black text-cv-gray-900">
                    {isLoading ? '...' : (data?.users.total ?? 0)}
                  </p>
                </div>
                <HiOutlineUsers className="size-6 text-cv-primary-500" />
              </div>
              <p className="mt-3 text-sm text-cv-gray-400">
                {isLoading ? '...' : (data?.users.active ?? 0)} active users,{' '}
                {isLoading ? '...' : (data?.users.dealers ?? 0)} marked as dealers.
              </p>
            </div>

            <div className="rounded-[18px] border border-cv-gray-50 bg-cv-gray-10 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-cv-gray-400">Orders</p>
                  <p className="mt-3 text-2xl font-black text-cv-gray-900">
                    {isLoading ? '...' : (data?.orders.total ?? 0)}
                  </p>
                </div>
                <HiOutlineCheckBadge className="size-6 text-emerald-500" />
              </div>
              <p className="mt-3 text-sm text-cv-gray-400">
                {isLoading ? '...' : (data?.orders.completed ?? 0)} completed,{' '}
                {isLoading ? '...' : (data?.orders.payment_failed ?? 0)} payment failed.
              </p>
            </div>

            <div className="rounded-[18px] border border-cv-gray-50 bg-cv-gray-10 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-cv-gray-400">Escrow</p>
                  <p className="mt-3 text-2xl font-black text-cv-gray-900">
                    {isLoading ? '...' : (data?.escrow.held ?? 0)}
                  </p>
                </div>
                <HiOutlineCreditCard className="size-6 text-cv-primary-500" />
              </div>
              <p className="mt-3 text-sm text-cv-gray-400">
                {isLoading ? '...' : (data?.escrow.released ?? 0)} released,{' '}
                {isLoading ? '...' : (data?.escrow.refunded ?? 0)} refunded.
              </p>
            </div>

            <div className="rounded-[18px] border border-cv-gray-50 bg-cv-gray-10 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-cv-gray-400">Referrals</p>
                  <p className="mt-3 text-2xl font-black text-cv-gray-900">
                    {isLoading ? '...' : (data?.referrals.earned_count ?? 0)}
                  </p>
                </div>
                <HiOutlineArrowTrendingUp className="size-6 text-cv-primary-500" />
              </div>
              <p className="mt-3 text-sm text-cv-gray-400">
                {isLoading ? '...' : (data?.referrals.paid_count ?? 0)} paid commissions worth{' '}
                {isLoading ? '...' : formatCurrency(data?.referrals.paid_amount)}.
              </p>
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Quick Links"
          description="Jump directly into the most important V1 workflows."
        >
          <div className="grid gap-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[18px] border border-cv-gray-50 bg-cv-gray-10 px-4 py-4 transition-colors hover:bg-cv-gray-25"
                >
                  <Icon className="size-5 text-cv-primary-500" />
                  <p className="mt-3 text-base font-bold text-cv-gray-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-cv-gray-400">{item.description}</p>
                </Link>
              );
            })}
          </div>
        </AdminSectionCard>
      </div>
    </AdminPageScaffold>
  );
}
