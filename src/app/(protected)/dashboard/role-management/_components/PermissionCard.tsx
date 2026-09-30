import { cn } from '@/lib/twMerge';
import { ReactNode } from 'react';

export const PermissionCard = ({ children }: { children: ReactNode }) => {
  return <div className="bg-[#F9FAFB] border border-[#EAEBEC] p-4 rounded-2xl">{children}</div>;
};

PermissionCard.displayName = 'PermissionCard';

export const PermissionCardHeader = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <h1 className={cn('text-[#2B3545] text-lg font-bold', className)}>{children}</h1>;
};

PermissionCardHeader.displayName = 'PermissionCardHeader';
