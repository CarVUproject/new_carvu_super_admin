'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import SubmitButton from '@/components/ui/SubmitButton';

let openModalCount = 0;
const scrollLockSnapshot = {
  bodyOverflow: '',
  htmlOverflow: '',
  bodyPaddingRight: '',
};

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

type CvModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  showHeader?: boolean;
  footerNeeded?: boolean;
  size?: ModalSize;
  children: ReactNode;
  className?: string;
  wrapperClassNames?: string;
};

const sizeClasses: Record<ModalSize, string> = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-lg',
  lg: 'sm:max-w-5xl',
  xl: 'sm:max-w-[1072px]',
};

export default function CvModal({
  isOpen,
  onClose,
  title = 'Modal Title',
  showHeader = true,
  footerNeeded = false,
  size = 'md',
  children,
  className,
  wrapperClassNames,
}: CvModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    if (openModalCount === 0) {
      scrollLockSnapshot.bodyOverflow = body.style.overflow;
      scrollLockSnapshot.htmlOverflow = documentElement.style.overflow;
      scrollLockSnapshot.bodyPaddingRight = body.style.paddingRight;

      body.style.overflow = 'hidden';
      documentElement.style.overflow = 'hidden';

      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    openModalCount += 1;

    return () => {
      openModalCount = Math.max(0, openModalCount - 1);

      if (openModalCount === 0) {
        body.style.overflow = scrollLockSnapshot.bodyOverflow;
        documentElement.style.overflow = scrollLockSnapshot.htmlOverflow;
        body.style.paddingRight = scrollLockSnapshot.bodyPaddingRight;
      }
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[999] grid place-items-center overflow-y-auto bg-black/40 p-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={cn('relative my-12 flex justify-center', wrapperClassNames)}>
            <motion.div
              ref={modalRef}
              className={cn(
                'w-full overflow-hidden rounded-3xl bg-white shadow-xl',
                sizeClasses[size],
                className,
              )}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            >
              {showHeader ? (
                <div className="flex items-center justify-between border-b border-cv-gray-50 px-6 py-4">
                  <h2 className="text-xl font-semibold text-cv-gray-900">{title}</h2>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl px-3 py-2 text-cv-gray-400 transition-colors hover:bg-cv-gray-10 hover:text-cv-gray-900"
                  >
                    ✕
                  </button>
                </div>
              ) : null}

              <div className="px-6 py-5">{children}</div>

              {footerNeeded ? (
                <div className="flex justify-end border-t border-cv-gray-50 bg-cv-gray-10 px-6 py-4">
                  <SubmitButton text="Close" type="button" variant="base" onClick={onClose} />
                </div>
              ) : null}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
