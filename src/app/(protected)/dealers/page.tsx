'use client';

import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiOutlineCheck, HiOutlineXMark } from 'react-icons/hi2';
import { useForm } from 'react-hook-form';

import { AdminCellStack, AdminDataTable } from '@/components/admin/AdminDataTable';
import { AdminDrawer } from '@/components/admin/AdminDrawer';
import { AdminKeyValueList } from '@/components/admin/AdminDetailsPanel';
import {
  AdminCompactFilterBar,
  AdminCompactSelect,
  AdminSearchToolbar,
} from '@/components/admin/AdminCompactFilters';
import { AdminPageScaffold } from '@/components/admin/AdminPageScaffold';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import CvModal from '@/components/ui/CvModal';
import ErrorLabel from '@/components/ui/ErrorLabel';
import SubmitButton from '@/components/ui/SubmitButton';
import {
  useApproveSuperAdminDealerMutation,
  useGetSuperAdminDealerQuery,
  useGetSuperAdminDealersQuery,
  useGetSuperAdminRolesQuery,
  useRejectSuperAdminDealerMutation,
} from '@/features/super-admin/superAdminApi';
import { useAdminTableQueryForm } from '@/hooks/useAdminTableQueryForm';
import { downloadCsv } from '@/lib/downloadCsv';
import { formatDate, titleCase } from '@/lib/format';
import {
  superAdminDealerApprovalSchema,
  type SuperAdminDealerApprovalFormValues,
} from '@/schemas/super-admin-dealer-approval.schema';
import type { DealerListItem } from '@/types/super-admin';

function formatAddress(
  address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  } | null,
) {
  if (!address) {
    return 'N/A';
  }

  return [address.street, address.city, address.state, address.postal_code, address.country]
    .filter(Boolean)
    .join(', ');
}

const dealerQueryDefaults = {
  search: '',
  status: '',
};

const dealerFilterKeys = ['status'] as const;

export default function DealersPage() {
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const {
    form: queryForm,
    queryValues,
    queryParams,
    page,
    setPage,
    activeFilterCount,
    hasSearch,
    setField,
    applySearch,
    clearSearch,
    applyFilters,
    resetFilters,
  } = useAdminTableQueryForm({
    defaultValues: dealerQueryDefaults,
    filterKeys: [...dealerFilterKeys],
  });
  const searchInput = queryForm.watch('search');

  const { data, isLoading, isFetching } = useGetSuperAdminDealersQuery(queryParams);
  const { data: selectedDealer, isLoading: isDealerLoading } = useGetSuperAdminDealerQuery(
    selectedDealerId ?? '',
    {
      skip: !selectedDealerId,
    },
  );
  const { data: rolesData } = useGetSuperAdminRolesQuery(undefined);
  const [approveDealer, { isLoading: isApproving }] = useApproveSuperAdminDealerMutation();
  const [rejectDealer, { isLoading: isRejecting }] = useRejectSuperAdminDealerMutation();
  const approvalForm = useForm<SuperAdminDealerApprovalFormValues>({
    resolver: zodResolver(superAdminDealerApprovalSchema),
    defaultValues: {
      roles: [],
    },
  });

  const columns = useMemo<ColumnDef<DealerListItem>[]>(
    () => [
      {
        accessorKey: 'operating_name',
        header: 'Dealer',
        cell: ({ row }) => (
          <AdminCellStack
            title={row.original.operating_name}
            subtitle={row.original.user_full_name || row.original.user_email}
          />
        ),
      },
      {
        accessorKey: 'dealership_email',
        header: 'Contact',
        cell: ({ row }) => (
          <AdminCellStack
            title={row.original.dealership_email}
            subtitle={row.original.dealership_phone || 'No phone'}
          />
        ),
      },
      {
        accessorKey: 'roles',
        header: 'Roles',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            {row.original.roles.length ? (
              row.original.roles.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-cv-gray-50 bg-cv-gray-10 px-2.5 py-1 text-xs font-semibold text-cv-gray-500"
                >
                  {role}
                </span>
              ))
            ) : (
              <span className="text-sm text-cv-gray-400">No roles</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'has_payment_method',
        header: 'Payment Method',
        cell: ({ row }) => (
          <AdminStatusBadge status={row.original.has_payment_method ? 'configured' : 'missing'} />
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <AdminStatusBadge status={row.original.status} />,
      },
      {
        accessorKey: 'created_at',
        header: 'Created',
        cell: ({ row }) => formatDate(row.original.created_at),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => {
              setSelectedDealerId(row.original.id);
              setIsDrawerOpen(true);
            }}
            className="rounded-xl border border-cv-gray-50 px-3 py-2 text-sm font-semibold text-cv-primary-500 transition-colors hover:bg-cv-gray-10"
          >
            View
          </button>
        ),
      },
    ],
    [],
  );

  const handleApprove = approvalForm.handleSubmit(async (values) => {
    if (!selectedDealerId) {
      return;
    }

    await approveDealer({
      id: selectedDealerId,
      roles: values.roles,
    }).unwrap();

    setIsApproveModalOpen(false);
    approvalForm.reset({ roles: [] });
  });

  const handleReject = async () => {
    if (!selectedDealerId) {
      return;
    }

    await rejectDealer({
      id: selectedDealerId,
      reason: rejectReason,
    }).unwrap();

    setRejectReason('');
    setIsRejectModalOpen(false);
  };

  async function handleExport() {
    setIsExporting(true);
    try {
      await downloadCsv({
        path: 'super-admin/dealers/export/',
        filename: 'super-admin-dealers.csv',
        params: queryValues,
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <AdminPageScaffold
      title="Dealers"
      description="Review dealer registrations, inspect documents and banking context, and take approval actions from a single operational screen."
      actions={
        <SubmitButton
          type="button"
          text={isExporting ? 'Exporting...' : 'Export CSV'}
          width="auto"
          loading={isExporting}
          onClick={handleExport}
        />
      }
    >
      <AdminSearchToolbar
        label="Search dealers"
        placeholder="Operating name, dealership email, or owner name"
        value={searchInput}
        onChange={(value) => setField('search', value)}
        onSearch={applySearch}
        onClear={clearSearch}
        isSearching={isFetching}
        hasSearch={hasSearch}
      />

      <AdminCompactFilterBar
        onApply={applyFilters}
        onReset={resetFilters}
        isApplying={isFetching}
        activeCount={activeFilterCount}
      >
        <AdminCompactSelect label="Status" {...queryForm.register('status')}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </AdminCompactSelect>
      </AdminCompactFilterBar>

      <AdminDataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        totalCount={data?.count ?? 0}
        page={page}
        onPageChange={setPage}
        emptyTitle="No dealers found"
        emptyDescription="Try changing the search or status filters."
      />

      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Dealer Detail"
        description="Review the dealer business profile, uploaded documents, and banking setup from one drawer."
        actions={
          selectedDealer?.status === 'pending' ? (
            <>
              <SubmitButton
                type="button"
                text="Approve Dealer"
                width="auto"
                loading={isApproving}
                onClick={() => {
                  approvalForm.reset({ roles: [] });
                  setIsApproveModalOpen(true);
                }}
                icon={<HiOutlineCheck className="size-4" />}
              />
              <SubmitButton
                type="button"
                text="Reject Dealer"
                width="auto"
                variant="base"
                onClick={() => setIsRejectModalOpen(true)}
                icon={<HiOutlineXMark className="size-4" />}
              />
            </>
          ) : null
        }
      >
        {isDealerLoading ? (
          <p className="text-sm text-cv-gray-400">Loading dealer details...</p>
        ) : selectedDealer ? (
          <div className="space-y-5">
            <AdminKeyValueList
              items={[
                { label: 'Operating Name', value: selectedDealer.operating_name },
                {
                  label: 'Owner',
                  value: `${selectedDealer.user.full_name || 'N/A'} (${selectedDealer.user.email})`,
                },
                { label: 'Status', value: <AdminStatusBadge status={selectedDealer.status} /> },
                {
                  label: 'Dealer Class',
                  value: titleCase(selectedDealer.dealer_class),
                },
                {
                  label: 'Business Type',
                  value: titleCase(selectedDealer.business_type),
                },
                {
                  label: 'Primary Address',
                  value: formatAddress(selectedDealer.primary_address),
                },
                {
                  label: 'Banking Setup',
                  value: selectedDealer.payment_method
                    ? `${selectedDealer.payment_method.bank_name} • ${selectedDealer.payment_method.account_holder}`
                    : 'No payment method added',
                },
              ]}
            />

            <div className="grid gap-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-cv-gray-400">
                Documents
              </h3>
              {selectedDealer.dealer_documents.length ? (
                selectedDealer.dealer_documents.map((document) => (
                  <a
                    key={document.id}
                    href={document.file}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3 text-sm text-cv-gray-500 transition-colors hover:bg-cv-gray-25"
                  >
                    <p className="font-semibold text-cv-gray-900">
                      {titleCase(document.file_type)}
                    </p>
                    <p className="mt-1 text-xs text-cv-gray-400">
                      Added {formatDate(document.created_at)}
                    </p>
                  </a>
                ))
              ) : (
                <p className="text-sm text-cv-gray-400">No dealer documents uploaded yet.</p>
              )}
            </div>
            {approvalForm.formState.errors.roles?.message ? (
              <ErrorLabel text={approvalForm.formState.errors.roles.message} />
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-cv-gray-400">
            Choose a dealer from the table to open the review drawer.
          </p>
        )}
      </AdminDrawer>

      <CvModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Approve Dealer"
      >
        <div className="space-y-4">
          <p className="text-sm leading-6 text-cv-gray-400">
            Dealer approval must include at least one role so the approved account gets the right
            frontend and permission experience immediately.
          </p>

          <div className="grid gap-2">
            <p className="text-sm font-semibold text-cv-gray-500">Assign roles</p>
            <div className="grid gap-2">
              {(rolesData?.results ?? []).map((role) => {
                const selectedRoles = approvalForm.watch('roles');
                const isChecked = selectedRoles.includes(role.name);

                return (
                  <label
                    key={role.name}
                    className="flex items-center gap-3 rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(event) => {
                        const nextRoles = event.target.checked
                          ? [...selectedRoles, role.name]
                          : selectedRoles.filter((selectedRole) => selectedRole !== role.name);

                        approvalForm.setValue('roles', nextRoles, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }}
                      className="size-4 rounded border-cv-gray-50"
                    />
                    <div>
                      <p className="text-sm font-semibold text-cv-gray-900">{role.name}</p>
                      <p className="text-xs text-cv-gray-400">
                        {role.permissions.length} permissions
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <SubmitButton
              type="button"
              text="Cancel"
              width="auto"
              variant="base"
              onClick={() => setIsApproveModalOpen(false)}
            />
            <SubmitButton
              type="button"
              text="Confirm Approval"
              width="auto"
              loading={isApproving}
              onClick={handleApprove}
            />
          </div>
        </div>
      </CvModal>

      <CvModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Reject Dealer"
      >
        <div className="space-y-4">
          <p className="text-sm leading-6 text-cv-gray-400">
            Add a note so the rejection reason is clear in the audit trail and future review.
          </p>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-cv-gray-500">Reason</span>
            <textarea
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              rows={5}
              className="w-full rounded-[16px] border border-[#D5D7DA] px-3.5 py-3 text-sm text-cv-gray-900 transition-colors focus:border-cv-gray-400 focus:outline-none hover:border-cv-gray-400"
              placeholder="Missing documents, invalid business details, or any other review note"
            />
          </label>
          <div className="flex justify-end gap-2">
            <SubmitButton
              type="button"
              text="Cancel"
              width="auto"
              variant="base"
              onClick={() => setIsRejectModalOpen(false)}
            />
            <SubmitButton
              type="button"
              text="Reject Dealer"
              width="auto"
              loading={isRejecting}
              onClick={handleReject}
            />
          </div>
        </div>
      </CvModal>
    </AdminPageScaffold>
  );
}
