import type { SelectHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type AdminSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  wrapperClassName?: string;
};

export function AdminSelect({ className, label, wrapperClassName, ...props }: AdminSelectProps) {
  return (
    <label className={cn('grid gap-2', wrapperClassName)}>
      {label ? <span className="text-sm font-semibold text-cv-gray-500">{label}</span> : null}
      <select
        className={cn(
          'w-full rounded-[12px] border border-[#D5D7DA] bg-white px-3.5 py-2.5 text-sm text-cv-gray-900 inset-shadow-xs transition-colors focus:border-cv-gray-400 focus:outline-none hover:border-cv-gray-400',
          className,
        )}
        {...props}
      />
    </label>
  );
}
