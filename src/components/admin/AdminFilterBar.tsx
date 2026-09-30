import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AdminFilterBarProps = {
  children: ReactNode;
  className?: string;
};

export function AdminFilterBar({ children, className }: AdminFilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-[22px] border border-cv-gray-50 bg-white px-4 py-4 shadow-sm lg:flex-row lg:items-end lg:justify-between',
        className,
      )}
    >
      {children}
    </div>
  );
}
