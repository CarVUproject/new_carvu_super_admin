import { cn } from '@/lib/twMerge';

interface HighlightBadgeProps {
  status?: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  className?: string;
  label: string;
}

export const HighlightBadge = ({ status, label, className }: HighlightBadgeProps) => {
  const statusColor = {
    pending: 'bg-[#FFF5EB] text-[#E89600] border-[#E89600]',
    approved: 'bg-[#ECFDF5] text-[#08A100] border-[#08A100]',
    rejected: 'bg-[#FFEBEB] text-[#FF2626] border-[#FF2626]',
    active: 'bg-[#ECFDF5] text-[#08A100] border-[#08A100]',
    inactive: 'bg-[#FFEBEB] text-[#FF2626] border-[#FF2626]',
    default: 'bg-gray-500 text-white border-gray-500',
  } as const;

  const colorClass =
    status && statusColor[status?.toLowerCase() as keyof typeof statusColor]
      ? statusColor[status?.toLowerCase() as keyof typeof statusColor]
      : statusColor.default;

  return (
    <div
      className={cn(
        'w-fit px-2 py-[2px] text-sm/4.5 text-center border rounded-sm',
        colorClass,
        className,
      )}
    >
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </div>
  );
};

HighlightBadge.displayName = 'HighlightBadge';
