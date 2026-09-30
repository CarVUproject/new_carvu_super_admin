'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiChevronDown, HiOutlineBars3 } from 'react-icons/hi2';

import { ADMIN_NAVIGATION } from '@/constants/admin-navigation';
import { cn } from '@/lib/utils';

function groupShouldBeOpen(pathname: string, hrefs: string[]) {
  return hrefs.some((href) => pathname === href || pathname.startsWith(`${href}/`));
}

export function AdminMobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const activeGroup = useMemo(
    () =>
      ADMIN_NAVIGATION.find((group) =>
        groupShouldBeOpen(
          pathname,
          group.items.map((item) => item.href),
        ),
      ) ?? ADMIN_NAVIGATION[0],
    [pathname],
  );

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between rounded-[20px] border border-white/70 bg-white px-4 py-4 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-cv-primary-10 text-cv-primary-500">
            <HiOutlineBars3 className="size-5" />
          </span>
          <div className="text-left">
            <p className="text-sm font-semibold text-cv-gray-300">Navigation</p>
            <p className="text-base font-bold text-cv-gray-900">{activeGroup.title}</p>
          </div>
        </div>
        <HiChevronDown
          className={cn('size-5 text-cv-gray-400 transition-transform', isOpen && 'rotate-180')}
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
            <div className="mt-3 space-y-3 rounded-[24px] border border-white/70 bg-white p-4 shadow-sm">
              {ADMIN_NAVIGATION.map((group) => (
                <div key={group.title} className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cv-primary-300">
                    {group.title}
                  </p>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive =
                        pathname === item.href || pathname.startsWith(`${item.href}/`);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            'flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm transition-colors',
                            isActive
                              ? 'bg-cv-secondary-600 font-semibold text-white'
                              : 'bg-cv-gray-10 text-cv-gray-500 hover:bg-cv-gray-25',
                          )}
                        >
                          <span>{item.title}</span>
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
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
