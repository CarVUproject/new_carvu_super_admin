import { cn } from '@/lib/utils';
import { titleCase } from '@/lib/format';

type AdminStatusBadgeProps = {
  status?: string | null;
  className?: string;
};

const statusStyles: Record<string, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-700',
  approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  rejected: 'border-rose-200 bg-rose-50 text-rose-700',
  active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  inactive: 'border-cv-gray-50 bg-cv-gray-10 text-cv-gray-500',
  true: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  false: 'border-cv-gray-50 bg-cv-gray-10 text-cv-gray-500',
};

export function AdminStatusBadge({ status, className }: AdminStatusBadgeProps) {
  const normalizedStatus = String(status ?? 'unknown').toLowerCase();

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold',
        statusStyles[normalizedStatus] ?? 'border-sky-200 bg-sky-50 text-sky-700',
        className,
      )}
    >
      {titleCase(normalizedStatus)}
    </span>
  );
}
