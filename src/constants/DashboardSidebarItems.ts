import { CloverIcon } from '@/components/icons/CloverIcon';
import { HandshakeIcon } from '@/components/icons/HandshakeIcon';
import { HeadsetIcon } from '@/components/icons/HeadsetIcon';
import { MailIcon } from '@/components/icons/MailIcon';
import { PaymentIcon } from '@/components/icons/PaymentIcon';
import { PeopleIcon } from '@/components/icons/PeopleIcon';
import { PersonAndMoneyIcon } from '@/components/icons/PersonAndMoneyIcon';
import { PersonIcon } from '@/components/icons/PersonIcon';
import { GearIcon } from '@/components/icons/GearIcon';
import { SignoutIcon } from '@/components/icons/SignoutIcon';
import { TextDocumentIcon } from '@/components/icons/TextDocumentIcon';
import { ToolboxIcon } from '@/components/icons/ToolboxIcon';
import { GavelIcon } from '@/components/icons/GavelIcon';

export const SIDEBAR_ITEMS = [
  {
    title: 'Overview',
    children: [
      {
        title: 'Dashboard',
        icon: CloverIcon,
        href: '/dashboard',
      },
      {
        title: 'Role Management',
        icon: PeopleIcon,
        href: '/dashboard/role-management',
      },
      { title: 'User Management', icon: PersonIcon, href: '/dashboard/user-management' },
      { title: 'Dealer Management', icon: HandshakeIcon, href: '/dashboard/dealer-management' },
      { title: 'Buyer Management', icon: PersonAndMoneyIcon, href: '/dashboard/buyer-management' },
      { title: 'Auction Management', icon: GavelIcon, href: '/dashboard/auction-management' },
      {
        title: 'Services/Solutions',
        icon: ToolboxIcon,
        href: '/dashboard/services-solutions',
      },
      { title: 'Billing', icon: PaymentIcon, href: '/dashboard/billing' },
      { title: 'Plan Management', icon: TextDocumentIcon, href: '/dashboard/plan-management' },
    ],
  },
] as const;

export const SIDEBAR_BOTTOM_ITEMS = [
  { title: 'Setting', icon: GearIcon, href: '#' },
  { title: 'Messages', icon: MailIcon, href: '#' },
  { title: 'Help and support', icon: HeadsetIcon, href: '#' },
  { title: 'Log out', icon: SignoutIcon, href: '#' },
] as const;
