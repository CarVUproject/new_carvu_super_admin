'use client';

import { usePathname } from 'next/navigation';
import { HiOutlineBell } from 'react-icons/hi2';

import type { UserType } from '@/types/user.types';
import { getRouteMeta } from '@/constants/admin-navigation';

type AdminTopbarProps = {
  user: UserType;
};

export function AdminTopbar({ user }: AdminTopbarProps) {
  const pathname = usePathname();
  const routeMeta = getRouteMeta(pathname);
  const initials = (user.full_name || user.email || 'SA')
    .split(' ')
    .map((chunk) => chunk[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex flex-col gap-4 rounded-[24px] border border-white/70 bg-white/95 px-5 py-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cv-primary-300">
          {routeMeta.title}
        </p>
        <h2 className="text-2xl font-black tracking-tight text-cv-gray-900">
          {routeMeta.description}
        </h2>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          className="grid size-11 place-items-center rounded-2xl border border-cv-gray-50 bg-cv-gray-10 text-cv-gray-400 transition-colors hover:bg-cv-gray-25 hover:text-cv-gray-900"
        >
          <HiOutlineBell className="size-5" />
        </button>
        <div className="flex items-center gap-3 rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-3 py-2">
          <div className="grid size-11 place-items-center rounded-2xl bg-cv-primary-500 text-sm font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-cv-gray-900">
              {user.full_name || 'Super Admin'}
            </p>
            <p className="truncate text-xs text-cv-gray-300">{user.email}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
