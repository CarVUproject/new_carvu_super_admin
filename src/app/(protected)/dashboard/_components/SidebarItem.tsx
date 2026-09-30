'use client';

import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ReactNode } from 'react';
import Link from 'next/link';
import { FaAngleDown } from 'react-icons/fa6';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/twMerge';
import { SidebarLinkType } from '@/types/sidebar';

interface SidebarItemProps {
  title: string;
  defaultExpanded?: boolean;
  children: ReactNode;
}

export const SidebarItem = ({ title, defaultExpanded = true, children }: SidebarItemProps) => {
  return (
    <div>
      <Accordion
        defaultExpanded={defaultExpanded}
        disableGutters
        className="!shadow-none !border-0"
      >
        <AccordionSummary expandIcon={<FaAngleDown />} className="!pl-2 !py-0">
          <h2 className="text-lg font-bold  font-lato text-[#9DA2A9]">{title}</h2>
        </AccordionSummary>

        <AccordionDetails className="!px-0 pb-2 pt-0">
          <div className="space-y-2">{children}</div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export const SidebarLink = ({ item }: { item: SidebarLinkType }) => {
  const pathname = usePathname();
  const isActive =
    item.href === '/dashboard'
      ? pathname === item.href
      : pathname.includes(item.href.split('/').slice(1, 3).join('/'));

  return (
    <Link
      href={item.href}
      className={cn(
        'w-full flex items-center py-2 text-lg pl-4 text-[#555D6A] font-semibold rounded-lg cursor-pointer font-lato group',
        isActive ? 'text-white' : 'text-gray-700 hover:bg-[#099D01] hover:text-white',
      )}
      style={isActive ? { backgroundColor: '#099D01' } : {}}
    >
      <item.icon
        className={cn('mr-3 text-[#555D6A] group-hover:text-white', isActive && 'text-white')}
      />
      {item.title}
    </Link>
  );
};

SidebarLink.displayName = 'SidebarLink';

interface SidebarBottomLinkProps {
  item: SidebarLinkType;
  onClick?: () => void;
  variant?: 'default' | 'logout';
}

export function SidebarBottomLink({ item, onClick, variant = 'default' }: SidebarBottomLinkProps) {
  const isLogout = variant === 'logout';
  const handleClick = isLogout ? onClick : undefined;

  const baseClasses =
    'w-full flex items-center pl-4 py-2 text-lg font-semibold rounded-lg cursor-pointer font-lato group hover:text-white';
  const activeClasses = isLogout
    ? '!text-red-600 hover:bg-red-50'
    : 'text-gray-700 hover:bg-[#099D01]';

  return isLogout ? (
    <button onClick={handleClick} className={cn(baseClasses, activeClasses)}>
      <item.icon
        width={28}
        height={28}
        className={cn(
          'mr-3 text-[#555D6A] group-hover:text-white',
          'text-red-600 group-hover:text-red-700',
        )}
      />
      {item.title}
    </button>
  ) : (
    <Link href={item.href!} className={cn(baseClasses, activeClasses)}>
      <item.icon
        width={28}
        height={28}
        className={cn('mr-3 text-[#555D6A] group-hover:text-white')}
      />
      {item.title}
    </Link>
  );
}
