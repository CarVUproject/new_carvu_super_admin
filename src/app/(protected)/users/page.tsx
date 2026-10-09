'use client';

import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ColumnDef } from '@tanstack/react-table';
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
import CvInput from '@/components/ui/CvInput';
import ErrorLabel from '@/components/ui/ErrorLabel';
import SubmitButton from '@/components/ui/SubmitButton';
import {
  useGetSuperAdminRolesQuery,
  useGetSuperAdminUserQuery,
  useGetSuperAdminUsersQuery,
  useUpdateSuperAdminUserMutation,
} from '@/features/super-admin/superAdminApi';
import { useAdminTableQueryForm } from '@/hooks/useAdminTableQueryForm';
import { downloadCsv } from '@/lib/downloadCsv';
import { formatDate, titleCase } from '@/lib/format';
import {
  superAdminUserSchema,
  type SuperAdminUserFormValues,
} from '@/schemas/super-admin-user.schema';
import type { UserListItem } from '@/types/super-admin';

const userQueryDefaults = {
  search: '',
  is_active: '',
  is_dealer: '',
  role: '',
};

const userFilterKeys = ['is_active', 'is_dealer', 'role'] as const;

export default function UsersPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const {
    form: queryForm,
    queryValues,
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
    defaultValues: userQueryDefaults,
    filterKeys: [...userFilterKeys],
  });
  const searchInput = queryForm.watch('search');

  const { data, isLoading, isFetching } = useGetSuperAdminUsersQuery({
    page,
    search: queryValues.search,
    is_active: queryValues.is_active,
    is_dealer: queryValues.is_dealer,
    role: queryValues.role,
  });
  const { data: selectedUser, isLoading: isUserLoading } = useGetSuperAdminUserQuery(
    selectedUserId ?? '',
    {
      skip: !selectedUserId,
    },
  );
  const { data: rolesData } = useGetSuperAdminRolesQuery(undefined);
  const [updateUser, { isLoading: isSavingUser }] = useUpdateSuperAdminUserMutation();

  const form = useForm<SuperAdminUserFormValues>({
    resolver: zodResolver(superAdminUserSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      is_active: false,
      is_dealer: false,
      roles: [],
    },
  });

  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    form.reset({
      full_name: selectedUser.full_name ?? '',
      phone: selectedUser.phone ?? '',
      is_active: selectedUser.is_active,
      is_dealer: selectedUser.is_dealer,
      roles: selectedUser.roles ?? [],
    });
  }, [form, selectedUser]);

  const columns = useMemo<ColumnDef<UserListItem>[]>(
    () => [
      {
        accessorKey: 'full_name',
        header: 'User',
        cell: ({ row }) => (
          <AdminCellStack
            title={row.original.full_name || 'Unnamed user'}
            subtitle={row.original.email}
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
        accessorKey: 'is_active',
        header: 'Active',
        cell: ({ row }) => (
          <AdminStatusBadge status={row.original.is_active ? 'active' : 'inactive'} />
        ),
      },
      {
        accessorKey: 'dealer_status',
        header: 'Dealer',
        cell: ({ row }) =>
          row.original.is_dealer ? (
            <AdminStatusBadge status={row.original.dealer_status ?? 'pending'} />
          ) : (
            <span className="text-sm text-cv-gray-400">No dealer record</span>
          ),
      },
      {
        accessorKey: 'payment_method_count',
        header: 'Payment Methods',
        cell: ({ row }) => (
          <span className="font-semibold text-cv-gray-900">
            {row.original.payment_method_count}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => {
              setSelectedUserId(row.original.id);
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

  const onSubmit = form.handleSubmit(async (values) => {
    if (!selectedUserId) {
      return;
    }

    await updateUser({
      id: selectedUserId,
      body: {
        full_name: values.full_name,
        phone: values.phone ?? '',
        is_active: values.is_active,
        is_dealer: values.is_dealer,
        roles: values.roles,
      },
    }).unwrap();
  });

  const selectedRoleValues = form.watch('roles');

  async function handleExport() {
    setIsExporting(true);
    try {
      await downloadCsv({
        path: 'super-admin/users/export/',
        filename: 'super-admin-users.csv',
        params: {
          search: queryValues.search,
          is_active: queryValues.is_active,
          is_dealer: queryValues.is_dealer,
          role: queryValues.role,
        },
      });
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <AdminPageScaffold
      title="Users"
      description="Search platform users, inspect their dealer status and payment context, and update roles or account activity where needed."
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
        label="Search users"
        placeholder="Email, full name, phone, or referral code"
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
        <AdminCompactSelect label="Active State" {...queryForm.register('is_active')}>
          <option value="">All users</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Dealer Flag" {...queryForm.register('is_dealer')}>
          <option value="">All users</option>
          <option value="true">Dealers</option>
          <option value="false">Non-dealers</option>
        </AdminCompactSelect>
        <AdminCompactSelect label="Role" {...queryForm.register('role')}>
          <option value="">All roles</option>
          {(rolesData?.results ?? []).map((role) => (
            <option key={role.name} value={role.name}>
              {role.name}
            </option>
          ))}
        </AdminCompactSelect>
      </AdminCompactFilterBar>

      <AdminDataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        totalCount={data?.count ?? 0}
        page={page}
        onPageChange={setPage}
        emptyTitle="No users found"
        emptyDescription="Try changing the user filters or search term."
      />

      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="User Detail"
        description="Use the explicit save form to manage activity state, phone number, and role assignment."
        actions={
          selectedUser ? (
            <SubmitButton
              type="button"
              text="Save Changes"
              width="auto"
              loading={isSavingUser}
              onClick={onSubmit}
            />
          ) : null
        }
      >
        {isUserLoading ? (
          <p className="text-sm text-cv-gray-400">Loading user details...</p>
        ) : selectedUser ? (
          <div className="space-y-5">
            <AdminKeyValueList
              items={[
                { label: 'Email', value: selectedUser.email },
                { label: 'Referral Code', value: selectedUser.referral_code || 'N/A' },
                {
                  label: 'Dealer Status',
                  value: selectedUser.is_dealer ? (
                    <AdminStatusBadge status={selectedUser.dealer_status} />
                  ) : (
                    'Not a dealer'
                  ),
                },
                { label: 'Last Login', value: formatDate(selectedUser.last_login) },
              ]}
            />

            <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
              <div>
                <CvInput label="Full Name" {...form.register('full_name')} />
                {form.formState.errors.full_name?.message ? (
                  <ErrorLabel text={form.formState.errors.full_name.message} />
                ) : null}
              </div>
              <div>
                <CvInput label="Phone" {...form.register('phone')} />
                {form.formState.errors.phone?.message ? (
                  <ErrorLabel text={form.formState.errors.phone.message} />
                ) : null}
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.watch('is_active')}
                  onChange={(event) => form.setValue('is_active', event.target.checked)}
                  className="size-4 rounded border-cv-gray-50"
                />
                <span className="text-sm font-semibold text-cv-gray-900">
                  User account is active
                </span>
              </label>

              <div className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.watch('is_dealer')}
                    onChange={(event) =>
                      form.setValue('is_dealer', event.target.checked, {
                        shouldDirty: true,
                      })
                    }
                    className="size-4 rounded border-cv-gray-50"
                  />
                  <span className="text-sm font-semibold text-cv-gray-900">Dealer account</span>
                </label>
                <p className="mt-1 pl-7 text-xs text-cv-gray-400">
                  Fixes mislabeled signups (shows as a plain customer, or the account doesn&apos;t
                  carry dealer permissions). This alone does not create a Dealer record for the
                  Dealers approval page -- the user still needs to submit dealer registration for
                  that, or you can assign a role with vehicle:create/hub:create/hub:view below so
                  pushes and dealer actions work immediately.
                </p>
              </div>

              <div className="grid gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-cv-gray-500">Roles</p>
                  <p className="text-sm text-cv-gray-400">Assign one or more roles to this user.</p>
                </div>
                <div className="grid gap-2">
                  {(rolesData?.results ?? []).map((role) => {
                    const isChecked = selectedRoleValues.includes(role.name);

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
                              ? [...selectedRoleValues, role.name]
                              : selectedRoleValues.filter(
                                  (selectedRole) => selectedRole !== role.name,
                                );

                            form.setValue('roles', nextRoles, {
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
            </form>

            <div className="grid gap-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-cv-gray-400">
                Payment Methods
              </h3>
              {selectedUser.payment_methods.length ? (
                selectedUser.payment_methods.map((paymentMethod) => (
                  <div
                    key={paymentMethod.id}
                    className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-cv-gray-900">
                      {titleCase(paymentMethod.brand)} •••• {paymentMethod.last4 || 'N/A'}
                    </p>
                    <p className="mt-1 text-xs text-cv-gray-400">
                      {paymentMethod.is_default ? 'Default method' : 'Secondary method'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-cv-gray-400">No payment methods linked yet.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-cv-gray-400">
            Choose a user from the table to open the management drawer.
          </p>
        )}
      </AdminDrawer>
    </AdminPageScaffold>
  );
}
