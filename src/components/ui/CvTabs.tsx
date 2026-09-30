'use client';

import React, { cloneElement, useId } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

export type TabsValue = string;

export interface TabsListProps {
  value: TabsValue;
  onChange?: (value: TabsValue) => void;
  children: React.ReactNode;
  className?: string;
  layoutId?: string;
}

export type TabsTriggerProps = React.ComponentProps<'button'> & {
  value: TabsValue;
  isActive?: boolean;
  onChange?: (value: TabsValue) => void;
  icon?: React.ReactElement<React.SVGProps<SVGAElement>>;
  text: string;
  activeBgColor?: string;
  activeTextColor?: string;
  activeLayoutId?: string;
};

export function TabsList({ value, onChange, children, className = '', layoutId }: TabsListProps) {
  const childArray = Array.isArray(children) ? children : [children];
  const internalId = useId();
  const computedLayoutId = layoutId ?? internalId;

  return (
    <div
      className={cn(
        'relative flex gap-2 rounded-xl border border-cv-gray-50 bg-cv-gray-10 p-1 shadow-sm',
        className,
      )}
    >
      {childArray.map((child: any, index) =>
        cloneElement(child, {
          isActive:
            typeof child?.props?.value === 'string' &&
            typeof value === 'string' &&
            child.props?.value?.toLowerCase() === value?.toLowerCase(),
          onChange,
          key: index,
          activeLayoutId: computedLayoutId,
        }),
      )}
    </div>
  );
}

export function TabsTrigger({
  value,
  isActive,
  onChange,
  icon,
  text,
  activeBgColor = 'bg-cv-secondary-600',
  activeTextColor = 'text-white',
  type = 'button',
  className,
  activeLayoutId,
  ...props
}: TabsTriggerProps) {
  return (
    <button
      type={type}
      onClick={() => onChange?.(value)}
      className={cn(
        'relative cursor-pointer overflow-hidden rounded-lg px-4 py-2 text-sm font-medium text-cv-gray-300',
        className,
        isActive && activeTextColor,
      )}
      {...props}
    >
      {isActive ? (
        <motion.div
          layoutId={activeLayoutId ?? 'activeTab'}
          className={`absolute inset-0 ${activeBgColor} rounded-lg`}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      ) : null}
      <div className={cn('relative z-10 transition-colors', icon && 'flex items-center gap-2')}>
        {icon ? React.cloneElement(icon) : null}
        <span>{text}</span>
      </div>
    </button>
  );
}
