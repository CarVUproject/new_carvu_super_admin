import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AdminDetailsPanelProps = {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AdminDetailsPanel({
  title,
  description,
  actions,
  children,
  className,
}: AdminDetailsPanelProps) {
  return (
    <aside
      className={cn(
        'rounded-[22px] border border-cv-gray-50 bg-white px-5 py-5 shadow-sm',
        className,
      )}
    >
      <div className="flex flex-col gap-4 border-b border-cv-gray-50 pb-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-cv-gray-900">{title}</h2>
          <p className="text-sm leading-6 text-cv-gray-400">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      <div className="mt-5">{children}</div>
    </aside>
  );
}

export function AdminKeyValueList({
  items,
}: {
  items: Array<{ label: string; value: ReactNode }>;
}) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="grid gap-1 rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
            {item.label}
          </p>
          <div className="text-sm text-cv-gray-900">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
