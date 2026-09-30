'use client';

import { getDashboardName } from '@/utils/getDashboardName';
import { usePathname } from 'next/navigation';

export const DynamicDashboardTitle = () => {
  const pathname = usePathname();
  return (
    <div className="flex items-center">
      <h2 className="text-2xl font-bold font-lato text-[#2B3545]">{getDashboardName(pathname)}</h2>
    </div>
  );
};

DynamicDashboardTitle.displayName = 'DynamicDashboardTitle';
