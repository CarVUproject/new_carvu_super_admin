'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineXMark } from 'react-icons/hi2';

import { cn } from '@/lib/utils';

type AdminDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  blockInteraction?: boolean;
};

export function AdminDrawer({
  isOpen,
  onClose,
  title,
  description,
  actions,
  children,
  className,
  blockInteraction = false,
}: AdminDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Outside clicks close the drawer, but normal clicks inside the panel are ignored.
    function handlePointerDown(event: MouseEvent) {
      if (panelRef.current?.contains(event.target as Node)) {
        return;
      }

      onClose();
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          {blockInteraction ? (
            <motion.div
              className="fixed inset-0 z-40 bg-cv-gray-900/20 backdrop-blur-[1px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          ) : null}

          <motion.aside
            className={cn(
              'fixed bottom-0 right-0 top-0 z-50 w-full max-w-[460px] border-l border-cv-gray-50 bg-white shadow-2xl',
              className,
            )}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div ref={panelRef} className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-cv-gray-50 px-5 py-5">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black tracking-tight text-cv-gray-900">{title}</h2>
                  {description ? (
                    <p className="text-sm leading-6 text-cv-gray-400">{description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid size-10 shrink-0 place-items-center rounded-2xl border border-cv-gray-50 bg-cv-gray-10 text-cv-gray-400 transition-colors hover:bg-cv-gray-25 hover:text-cv-gray-900"
                  aria-label="Close drawer"
                >
                  <HiOutlineXMark className="size-5" />
                </button>
              </div>

              {actions ? (
                <div className="border-b border-cv-gray-50 px-5 py-4">
                  <div className="flex flex-wrap gap-2">{actions}</div>
                </div>
              ) : null}

              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
