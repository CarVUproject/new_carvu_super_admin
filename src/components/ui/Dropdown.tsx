'use client';
import { cn } from '@/lib/twMerge';
import React, { useEffect, useRef } from 'react';

interface DropdownMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dropdownWidth?: string;
  children: React.ReactNode;
  itemHoverBg?: string;
  itemPadding?: string;
}

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ children, className, ...props }) => {
  return (
    <button
      {...props}
      className={cn('flex items-center gap-2 w-full text-left transition-colors', className)}
    >
      {children}
    </button>
  );
};

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  open,
  onOpenChange,
  dropdownWidth = 'w-44',
  children,
  itemHoverBg = '#EEF5EE',
  itemPadding = 'px-3 py-2',
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!open) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        'absolute right-0 mt-2 bg-white shadow-lg border border-gray-100 z-10',
        dropdownWidth,
        'rounded-[12px] overflow-hidden',
      )}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const typedChild = child as React.ReactElement<
          React.ButtonHTMLAttributes<HTMLButtonElement>
        >;

        const isFirst = index === 0;
        const isLast = index === React.Children.count(children)! - 1;

        const radiusClass = cn(
          isFirst ? 'rounded-t-[12px]' : '',
          isLast ? 'rounded-b-[12px]' : '',
          !isFirst && !isLast ? 'rounded-none' : '',
        );

        return React.cloneElement(typedChild, {
          className: cn(
            typedChild.props.className,
            itemPadding,
            radiusClass,
            `hover:bg-[${itemHoverBg}]`,
          ),
          onClick: (e) => {
            typedChild.props.onClick?.(e);
            onOpenChange(false);
          },
        });
      })}
    </div>
  );
};
