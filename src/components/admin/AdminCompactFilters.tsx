import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { HiOutlineArrowPath, HiOutlineMagnifyingGlass, HiOutlineXMark } from 'react-icons/hi2';

import { cn } from '@/lib/utils';

type AdminCompactActionButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  type?: 'button' | 'submit';
};

function AdminCompactActionButton({
  children,
  onClick,
  variant = 'secondary',
  disabled,
  type = 'button',
}: AdminCompactActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' && 'bg-cv-secondary-600 text-white hover:bg-cv-secondary-500',
        variant === 'secondary' &&
          'border border-cv-gray-50 bg-white text-cv-gray-600 hover:bg-cv-gray-10',
        variant === 'ghost' && 'text-cv-secondary-600 hover:bg-cv-gray-10',
      )}
    >
      {children}
    </button>
  );
}

type AdminSearchToolbarProps = {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  isSearching?: boolean;
  hasSearch?: boolean;
};

export function AdminSearchToolbar({
  label,
  value,
  placeholder,
  onChange,
  onSearch,
  onClear,
  isSearching,
  hasSearch,
}: AdminSearchToolbarProps) {
  return (
    <div className="rounded-[22px] border border-cv-gray-50 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="grid min-w-0 flex-1 gap-1.5">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-cv-gray-400">
            {label}
          </span>
          <div className="relative">
            <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-cv-gray-300" />
            <input
              value={value}
              placeholder={placeholder}
              onChange={(event) => onChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onSearch();
                }
              }}
              className="h-10 w-full rounded-full border border-[#D5D7DA] bg-white pl-9 pr-3 text-sm text-cv-gray-900 transition-colors placeholder:text-cv-gray-300 hover:border-cv-gray-400 focus:border-cv-gray-400 focus:outline-none"
            />
          </div>
        </label>

        <div className="flex flex-wrap gap-2 lg:self-end">
          <AdminCompactActionButton variant="primary" onClick={onSearch}>
            <HiOutlineMagnifyingGlass className="size-4" />
            {isSearching ? 'Searching...' : 'Search'}
          </AdminCompactActionButton>
          <AdminCompactActionButton
            variant="ghost"
            onClick={onClear}
            disabled={!hasSearch && !value}
          >
            <HiOutlineXMark className="size-4" />
            Clear search
          </AdminCompactActionButton>
        </div>
      </div>
    </div>
  );
}

type AdminCompactFilterBarProps = {
  children: ReactNode;
  onApply: () => void;
  onReset: () => void;
  isApplying?: boolean;
  activeCount?: number;
};

export function AdminCompactFilterBar({
  children,
  onApply,
  onReset,
  isApplying,
  activeCount = 0,
}: AdminCompactFilterBarProps) {
  return (
    <div className="rounded-[22px] border border-cv-gray-50 bg-white px-4 py-3 shadow-sm">
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-cv-gray-400">Filters</p>
          {activeCount ? (
            <span className="rounded-full bg-cv-secondary-50 px-2 py-0.5 text-xs font-bold text-cv-secondary-600">
              {activeCount} active
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">{children}</div>

        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <AdminCompactActionButton variant="primary" onClick={onApply}>
            {isApplying ? 'Applying...' : 'Apply filters'}
          </AdminCompactActionButton>
          <AdminCompactActionButton variant="secondary" onClick={onReset}>
            <HiOutlineArrowPath className="size-4" />
            Reset filters
          </AdminCompactActionButton>
        </div>
      </div>
    </div>
  );
}

type AdminCompactTextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function AdminCompactTextInput({ label, className, ...props }: AdminCompactTextInputProps) {
  return (
    <label className="grid min-w-[148px] gap-1">
      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-cv-gray-400">
        {label}
      </span>
      <input
        className={cn(
          'h-9 rounded-full border border-[#D5D7DA] bg-white px-3 text-sm text-cv-gray-900 transition-colors placeholder:text-cv-gray-300 hover:border-cv-gray-400 focus:border-cv-gray-400 focus:outline-none',
          className,
        )}
        {...props}
      />
    </label>
  );
}

type AdminCompactSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export function AdminCompactSelect({ label, className, ...props }: AdminCompactSelectProps) {
  return (
    <label className="grid min-w-[150px] gap-1">
      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-cv-gray-400">
        {label}
      </span>
      <select
        className={cn(
          'h-9 rounded-full border border-[#D5D7DA] bg-white px-3 text-sm text-cv-gray-900 transition-colors hover:border-cv-gray-400 focus:border-cv-gray-400 focus:outline-none',
          className,
        )}
        {...props}
      />
    </label>
  );
}
