import { HamburgerMenuIcon } from '@/components/icons/HamburgerMenuIcon';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
}

export const PageHeader = ({ title, subtitle, rightSlot }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      {/* Left side */}
      <div className="flex gap-2">
        <HamburgerMenuIcon className="text-[#1F2A37] mt-1" />

        <div className="flex flex-col">
          <h1 className="text-[#2B3545] text-2xl font-bold">{title}</h1>
          {subtitle && <span className="text-[#717882] text-sm font-normal">{subtitle}</span>}
        </div>
      </div>

      {/* Right side (dynamic) */}
      {rightSlot && <div>{rightSlot}</div>}
    </div>
  );
};
