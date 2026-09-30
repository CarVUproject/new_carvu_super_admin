'use client';

import { useState } from 'react';

import { AdminPageScaffold, AdminSectionCard } from '@/components/admin/AdminPageScaffold';
import { useGetSuperAdminModulesQuery } from '@/features/super-admin/superAdminApi';

export default function ModulesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetSuperAdminModulesQuery({ page });

  const totalPages = Math.max(1, Math.ceil((data?.count ?? 0) / 10));

  return (
    <AdminPageScaffold
      title="Modules"
      description="Review the full module catalog and the permission codes that each module contributes to the access-control system."
    >
      <AdminSectionCard
        title="Permission Catalog"
        description="Modules are grouped permission buckets. This page is read-only in V1 and helps operators understand what each role can grant."
      >
        {isLoading ? (
          <p className="text-sm text-cv-gray-400">Loading modules...</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {(data?.results ?? []).map((module) => (
              <div
                key={module.code}
                className="rounded-[20px] border border-cv-gray-50 bg-cv-gray-10 px-4 py-4"
              >
                <p className="text-base font-bold text-cv-gray-900">{module.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-cv-gray-300">
                  {module.code}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {module.permissions.length ? (
                    module.permissions.map((permission) => (
                      <span
                        key={permission.code}
                        className="rounded-full border border-cv-gray-50 bg-white px-3 py-1 text-xs font-semibold text-cv-gray-500"
                      >
                        {permission.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-cv-gray-400">No permissions attached.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 ? (
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setPage((previousPage) => Math.max(1, previousPage - 1))}
              disabled={page <= 1}
              className="rounded-xl border border-cv-gray-50 px-3 py-2 text-sm font-semibold text-cv-gray-500 transition-colors hover:bg-cv-gray-10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((previousPage) => Math.min(totalPages, previousPage + 1))}
              disabled={page >= totalPages}
              className="rounded-xl border border-cv-primary-500 bg-cv-primary-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-cv-primary-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : null}
      </AdminSectionCard>
    </AdminPageScaffold>
  );
}
