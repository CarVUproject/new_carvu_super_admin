import type { IconType } from 'react-icons';
import {
  HiOutlineAdjustmentsHorizontal,
  HiOutlineBuildingOffice2,
  HiOutlineChartBarSquare,
  HiOutlineChartPie,
  HiOutlineClipboardDocumentList,
  HiOutlineCog6Tooth,
  HiOutlineCreditCard,
  HiOutlineDocumentChartBar,
  HiOutlineExclamationTriangle,
  HiOutlineKey,
  HiOutlineRectangleStack,
  HiOutlineShieldCheck,
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
  HiOutlineUsers,
} from 'react-icons/hi2';

export type AdminNavItem = {
  title: string;
  href: string;
  icon: IconType;
  description?: string;
  version?: 'V2' | 'V3';
};

export type AdminNavGroup = {
  title: string;
  icon: IconType;
  items: AdminNavItem[];
};

export const ADMIN_NAVIGATION: AdminNavGroup[] = [
  {
    title: 'Overview',
    icon: HiOutlineSquares2X2,
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: HiOutlineSquares2X2,
        description: 'Platform summary and priority queues.',
      },
    ],
  },
  {
    title: 'Operations',
    icon: HiOutlineClipboardDocumentList,
    items: [
      {
        title: 'Users',
        href: '/users',
        icon: HiOutlineUsers,
        description: 'User search, status, and role assignment.',
      },
      {
        title: 'Dealers',
        href: '/dealers',
        icon: HiOutlineBuildingOffice2,
        description: 'Dealer onboarding and approval review.',
      },
      {
        title: 'Orders',
        href: '/orders',
        icon: HiOutlineClipboardDocumentList,
        description: 'Order oversight and linked operations.',
      },
    ],
  },
  {
    title: 'Marketplace',
    icon: HiOutlineChartPie,
    items: [
      {
        title: 'Vehicles',
        href: '/vehicles',
        icon: HiOutlineClipboardDocumentList,
        description: 'Inventory and seller-readiness inspection.',
      },
      {
        title: 'Hub Listings',
        href: '/listings/hub',
        icon: HiOutlineRectangleStack,
        description: 'Marketplace listing health and availability.',
      },
      {
        title: 'Public Auctions',
        href: '/auctions/public',
        icon: HiOutlineChartBarSquare,
        description: 'Public auction activity and outcomes.',
      },
      {
        title: 'Wholesale Auctions',
        href: '/auctions/wholesale',
        icon: HiOutlineChartBarSquare,
        description: 'Wholesale auction activity and outcomes.',
      },
      {
        title: 'Negotiations',
        href: '/negotiations',
        icon: HiOutlineUserGroup,
        description: 'Offer timelines and deal flow inspection.',
      },
      {
        title: 'Arbitration',
        href: '/arbitration',
        icon: HiOutlineExclamationTriangle,
        description: 'Buyer and seller dispute review, inspection, and decisions.',
      },
      {
        title: 'Release Forms',
        href: '/release-forms',
        icon: HiOutlineDocumentChartBar,
        description: 'Standalone release form lifecycle review.',
        version: 'V2',
      },
    ],
  },
  {
    title: 'Subscriptions',
    icon: HiOutlineRectangleStack,
    items: [
      {
        title: 'Plans',
        href: '/subscriptions/plans',
        icon: HiOutlineRectangleStack,
        description: 'Sell-side plans and entitlements.',
      },
      {
        title: 'Policies',
        href: '/subscriptions/policies',
        icon: HiOutlineAdjustmentsHorizontal,
        description: 'Operation policies and subscription rules.',
      },
      {
        title: 'Dealer Subscriptions',
        href: '/subscriptions/dealers',
        icon: HiOutlineBuildingOffice2,
        description: 'Live subscription status per dealer.',
      },
      {
        title: 'Subscription Events',
        href: '/subscriptions/events',
        icon: HiOutlineDocumentChartBar,
        description: 'Stripe and subscription sync diagnostics.',
        version: 'V2',
      },
    ],
  },
  {
    title: 'Support',
    icon: HiOutlineUserGroup,
    items: [
      {
        title: 'Notifications',
        href: '/support/notifications',
        icon: HiOutlineDocumentChartBar,
        description: 'Notification delivery inspection.',
        version: 'V2',
      },
      {
        title: 'Chat',
        href: '/support/chat',
        icon: HiOutlineUserGroup,
        description: 'Conversation review for support investigations.',
        version: 'V2',
      },
    ],
  },
  {
    title: 'Referrals',
    icon: HiOutlineUserGroup,
    items: [
      {
        title: 'Referral Settings',
        href: '/referrals/settings',
        icon: HiOutlineCog6Tooth,
        description: 'Affiliate business rules and limits.',
      },
      {
        title: 'Commissions',
        href: '/referrals/commissions',
        icon: HiOutlineUserGroup,
        description: 'Referral commission visibility and payouts.',
      },
    ],
  },
  {
    title: 'Access Control',
    icon: HiOutlineKey,
    items: [
      {
        title: 'Roles',
        href: '/access/roles',
        icon: HiOutlineKey,
        description: 'Role creation and permission assignment.',
      },
      {
        title: 'Modules',
        href: '/access/modules',
        icon: HiOutlineAdjustmentsHorizontal,
        description: 'Module and permission catalog overview.',
      },
    ],
  },
  {
    title: 'Platform',
    icon: HiOutlineCog6Tooth,
    items: [
      {
        title: 'Business Config',
        href: '/settings/business-config',
        icon: HiOutlineCog6Tooth,
        description: 'Core commercial and operational settings.',
      },
      {
        title: 'Audit Logs',
        href: '/audit-logs',
        icon: HiOutlineDocumentChartBar,
        description: 'Sensitive admin action tracking.',
      },
    ],
  },
  {
    title: 'Reports',
    icon: HiOutlineChartBarSquare,
    items: [
      {
        title: 'Financial Reports',
        href: '/reports/financial',
        icon: HiOutlineChartBarSquare,
        description: 'Retainers, escrow, penalties, and commissions.',
      },
      {
        title: 'Dealer Funnel',
        href: '/reports/dealer-funnel',
        icon: HiOutlineChartPie,
        description: 'Dealer lifecycle conversion visibility.',
      },
    ],
  },
  {
    title: 'Future Payments',
    icon: HiOutlineCreditCard,
    items: [
      {
        title: 'Retainers',
        href: '/payments/retainers',
        icon: HiOutlineCreditCard,
        description: 'Dedicated retainer operations after V1.',
        version: 'V2',
      },
      {
        title: 'Escrow',
        href: '/payments/escrow',
        icon: HiOutlineShieldCheck,
        description: 'Dedicated escrow operations track.',
        version: 'V3',
      },
    ],
  },
];

export const ADMIN_ROUTE_ITEMS = ADMIN_NAVIGATION.flatMap((group) => group.items);

export function getRouteMeta(pathname: string) {
  const item =
    ADMIN_ROUTE_ITEMS.find((entry) => pathname === entry.href) ??
    ADMIN_ROUTE_ITEMS.find(
      (entry) => entry.href !== '/' && pathname.startsWith(`${entry.href}/`),
    ) ??
    ADMIN_ROUTE_ITEMS[0];

  return item;
}
