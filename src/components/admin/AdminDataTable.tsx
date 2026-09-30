'use client';

import type { ReactNode } from 'react';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';

import { cn } from '@/lib/utils';

type AdminDataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  page?: number;
  totalCount?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  className?: string;
};

function TableSkeleton() {
  return (
    <div className="space-y-3 px-4 py-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-12 animate-pulse rounded-2xl bg-cv-gray-10" />
      ))}
    </div>
  );
}

export function AdminDataTable<TData>({
  columns,
  data,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'Try adjusting your filters or check back later.',
  page = 1,
  totalCount = 0,
  pageSize = 10,
  onPageChange,
  className,
}: AdminDataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const hasRows = table.getRowModel().rows.length > 0;

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[22px] border border-cv-gray-50 bg-white shadow-sm',
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b border-cv-gray-50 bg-cv-gray-10 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-400"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <TableSkeleton />
                </td>
              </tr>
            ) : hasRows ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-cv-gray-10/60">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="border-b border-cv-gray-50 px-4 py-4 align-top text-sm text-cv-gray-500 last:border-r-0"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <p className="text-base font-semibold text-cv-gray-900">{emptyTitle}</p>
                  <p className="mt-2 text-sm text-cv-gray-400">{emptyDescription}</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {onPageChange && totalCount > pageSize ? (
        <div className="flex flex-col gap-3 border-t border-cv-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-cv-gray-400">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="inline-flex items-center gap-2 rounded-xl border border-cv-gray-50 px-3 py-2 text-sm font-semibold text-cv-gray-500 transition-colors hover:bg-cv-gray-10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <HiOutlineChevronLeft className="size-4" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-2 rounded-xl border border-cv-primary-500 bg-cv-primary-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-cv-primary-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <HiOutlineChevronRight className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AdminCellStack({
  title,
  subtitle,
  trailing,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <div className="font-semibold text-cv-gray-900">{title}</div>
        {subtitle ? <div className="text-sm text-cv-gray-400">{subtitle}</div> : null}
      </div>
      {trailing ? <div className="shrink-0">{trailing}</div> : null}
    </div>
  );
}
