'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiChevronRight, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';

import { ADMIN_NAVIGATION } from '@/constants/admin-navigation';
import { cn } from '@/lib/utils';

function groupShouldBeOpen(pathname: string, hrefs: string[]) {
  return hrefs.some((href) => pathname === href || pathname.startsWith(`${href}/`));
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const defaultState = useMemo(
    () =>
      Object.fromEntries(
        ADMIN_NAVIGATION.map((group) => [
          group.title,
          groupShouldBeOpen(
            pathname,
            group.items.map((item) => item.href),
          ),
        ]),
      ),
    [pathname],
  );

  useEffect(() => {
    setOpenGroups((current) => ({ ...defaultState, ...current }));
  }, [defaultState]);

  return (
    <aside className="sticky top-0 hidden h-screen w-[312px] shrink-0 overflow-hidden border-r border-white/70 bg-white xl:flex xl:flex-col">
      <div className="border-b border-cv-gray-50 px-6 py-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cv-primary-300">
            Carvu
          </p>
          <h1 className="text-2xl font-black tracking-tight text-cv-gray-900">Super Admin</h1>
          <p className="text-sm text-cv-gray-400">Operations control center</p>
        </div>
      </div>

      <nav className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {ADMIN_NAVIGATION.map((group) => {
          const isOpen = openGroups[group.title] ?? false;
          const isActiveGroup = groupShouldBeOpen(
            pathname,
            group.items.map((item) => item.href),
          );
          const GroupIcon = group.icon;

          return (
            <div
              key={group.title}
              className={cn(
                'rounded-[20px] border px-2 py-2 transition-colors',
                isActiveGroup
                  ? 'border-cv-primary-100 bg-cv-primary-10'
                  : 'border-transparent bg-cv-gray-10',
              )}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenGroups((current) => ({
                    ...current,
                    [group.title]: !isOpen,
                  }))
                }
                className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-2xl bg-white text-cv-primary-500 shadow-sm">
                    <GroupIcon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-cv-gray-900">{group.title}</p>
                    <p className="text-xs text-cv-gray-300">{group.items.length} pages</p>
                  </div>
                </div>
                <HiChevronRight
                  className={cn(
                    'size-5 text-cv-gray-300 transition-transform',
                    isOpen && 'rotate-90',
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1 px-2 pb-2 pt-1">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isActive =
                          pathname === item.href || pathname.startsWith(`${item.href}/`);

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              'flex items-start gap-3 rounded-2xl px-3 py-3 transition-colors',
                              isActive
                                ? 'bg-cv-secondary-600 text-white shadow-sm'
                                : 'text-cv-gray-500 hover:bg-white hover:text-cv-gray-900',
                            )}
                          >
                            <ItemIcon className="mt-0.5 size-5 shrink-0" />
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold">{item.title}</p>
                                {item.version ? (
                                  <span
                                    className={cn(
                                      'rounded-full px-2 py-0.5 text-[10px] font-black',
                                      isActive
                                        ? 'bg-white/15 text-white'
                                        : 'bg-cv-primary-10 text-cv-primary-500',
                                    )}
                                  >
                                    {item.version}
                                  </span>
                                ) : null}
                              </div>
                              <p
                                className={cn(
                                  'mt-1 text-xs leading-5',
                                  isActive ? 'text-white/80' : 'text-cv-gray-300',
                                )}
                              >
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-cv-gray-50 px-4 py-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3 text-left text-cv-gray-500 transition-colors hover:bg-cv-gray-25 hover:text-cv-gray-900"
        >
          <HiOutlineArrowRightOnRectangle className="size-5" />
          <div>
            <p className="text-sm font-semibold">Log out</p>
            <p className="text-xs text-cv-gray-300">Logout wiring comes in a later phase.</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
