'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { HiOutlineEllipsisVertical } from 'react-icons/hi2';

import { cn } from '@/lib/utils';

type AdminActionMenuItem = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  tone?: 'default' | 'danger';
};

type AdminActionMenuProps = {
  items: AdminActionMenuItem[];
};

export function AdminActionMenu({ items }: AdminActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current?.contains(event.target as Node)) {
        return;
      }

      setIsOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="grid size-10 place-items-center rounded-2xl border border-cv-gray-50 bg-white text-cv-gray-400 transition-colors hover:bg-cv-gray-10 hover:text-cv-gray-900"
        aria-label="Open row actions"
      >
        <HiOutlineEllipsisVertical className="size-5" />
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-12 z-30 min-w-[180px] rounded-2xl border border-cv-gray-50 bg-white p-2 shadow-xl">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                setIsOpen(false);
                item.onClick();
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors',
                item.tone === 'danger'
                  ? 'text-rose-600 hover:bg-rose-50'
                  : 'text-cv-gray-700 hover:bg-cv-gray-10',
              )}
            >
              {item.icon ? <span className="shrink-0">{item.icon}</span> : null}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
