import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AdminPageScaffoldProps = {
  title: string;
  description: string;
  eyebrow?: string;
  actions?: ReactNode;
  children?: ReactNode;
};

export function AdminPageScaffold({
  title,
  description,
  eyebrow = 'Super Admin',
  actions,
  children,
}: AdminPageScaffoldProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[24px] border border-white/70 bg-white px-6 py-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cv-primary-300">
            {eyebrow}
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-cv-gray-900">{title}</h1>
            <p className="max-w-3xl text-sm leading-6 text-cv-gray-400">{description}</p>
          </div>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

type AdminSectionCardProps = {
  title: string;
  description: string;
  className?: string;
  children?: ReactNode;
};

export function AdminSectionCard({
  title,
  description,
  className,
  children,
}: AdminSectionCardProps) {
  return (
    <div
      className={cn(
        'rounded-[22px] border border-cv-gray-50 bg-white px-6 py-6 shadow-sm',
        className,
      )}
    >
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-cv-gray-900">{title}</h2>
        <p className="text-sm leading-6 text-cv-gray-400">{description}</p>
      </div>
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

type AdminStatCardProps = {
  label: string;
  value: string;
  helper: string;
};

export function AdminStatCard({ label, value, helper }: AdminStatCardProps) {
  return (
    <div className="rounded-[22px] border border-cv-gray-50 bg-white px-5 py-5 shadow-sm">
      <p className="text-sm font-semibold text-cv-gray-400">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-cv-gray-900">{value}</p>
      <p className="mt-2 text-sm text-cv-gray-300">{helper}</p>
    </div>
  );
}
