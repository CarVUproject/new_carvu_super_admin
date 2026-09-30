import { cn } from '@/lib/twMerge';

type DashboardContentProps = {
  children: React.ReactNode;
  className?: string;
};

export const DashboardContent = ({ children, className }: DashboardContentProps) => {
  return (
    <div
      className={cn('bg-white p-4', 'rounded-[13.4px] border-[0.82px] border-[#EAEBEC]', className)}
    >
      {children}
    </div>
  );
};
