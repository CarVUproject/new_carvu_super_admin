'use client';

import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ColumnDef } from '@tanstack/react-table';
import { useForm } from 'react-hook-form';
import { HiOutlineEye, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';

import { AdminActionMenu } from '@/components/admin/AdminActionMenu';
import { AdminCellStack, AdminDataTable } from '@/components/admin/AdminDataTable';
import { AdminDrawer } from '@/components/admin/AdminDrawer';
import { AdminPageScaffold } from '@/components/admin/AdminPageScaffold';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import CvInput from '@/components/ui/CvInput';
import CvModal from '@/components/ui/CvModal';
import ErrorLabel from '@/components/ui/ErrorLabel';
import SubmitButton from '@/components/ui/SubmitButton';
import {
  useCreateSuperAdminRoleMutation,
  useDeleteSuperAdminRoleMutation,
  useGetSuperAdminModulesQuery,
  useGetSuperAdminRoleQuery,
  useGetSuperAdminRolesQuery,
  useUpdateSuperAdminRoleMutation,
} from '@/features/super-admin/superAdminApi';
import {
  superAdminRoleSchema,
  type SuperAdminRoleFormValues,
} from '@/schemas/super-admin-role.schema';
import type { RoleItem } from '@/types/super-admin';

type RoleModalMode = 'create' | 'edit';

export default function RolesPage() {
  const [page, setPage] = useState(1);
  const [selectedRoleName, setSelectedRoleName] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [modalMode, setModalMode] = useState<RoleModalMode>('create');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useGetSuperAdminRolesQuery({ page });
  const { data: selectedRole } = useGetSuperAdminRoleQuery(selectedRoleName ?? '', {
    skip: !selectedRoleName,
  });
  const { data: modulesData } = useGetSuperAdminModulesQuery(undefined);
  const [createRole, { isLoading: isCreatingRole }] = useCreateSuperAdminRoleMutation();
  const [updateRole, { isLoading: isUpdatingRole }] = useUpdateSuperAdminRoleMutation();
  const [deleteRole, { isLoading: isDeletingRole }] = useDeleteSuperAdminRoleMutation();

  const form = useForm<SuperAdminRoleFormValues>({
    resolver: zodResolver(superAdminRoleSchema),
    defaultValues: {
      name: '',
      is_active: true,
      permissions: [],
    },
  });

  useEffect(() => {
    if (modalMode !== 'edit' || !selectedRole || !isModalOpen) {
      return;
    }

    form.reset({
      name: selectedRole.name,
      is_active: selectedRole.is_active,
      permissions: selectedRole.permissions.map((permission) => permission.code),
    });
  }, [form, isModalOpen, modalMode, selectedRole]);

  const openEditModal = (role?: RoleItem) => {
    const sourceRole = role ?? selectedRole;

    if (!sourceRole) {
      return;
    }

    setSelectedRoleName(sourceRole.name);
    setModalMode('edit');
    form.reset({
      name: sourceRole.name,
      is_active: sourceRole.is_active,
      permissions: sourceRole.permissions.map((permission) => permission.code),
    });
    setIsModalOpen(true);
  };

  const handleDeleteRole = async (roleName = selectedRoleName) => {
    if (!roleName || !window.confirm(`Delete the "${roleName}" role?`)) {
      return;
    }

    await deleteRole(roleName).unwrap();

    if (selectedRoleName === roleName) {
      setSelectedRoleName(null);
      setIsDrawerOpen(false);
    }
  };

  const columns = useMemo<ColumnDef<RoleItem>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Role',
        cell: ({ row }) => (
          <AdminCellStack
            title={row.original.name}
            subtitle={`${row.original.permissions.length} permissions`}
          />
        ),
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => (
          <AdminStatusBadge status={row.original.is_active ? 'active' : 'inactive'} />
        ),
      },
      {
        accessorKey: 'permissions',
        header: 'Modules',
        cell: ({ row }) => {
          const moduleNames = Array.from(
            new Set(row.original.permissions.map((permission) => permission.module)),
          );

          return (
            <p className="text-sm text-cv-gray-500">
              {moduleNames.length ? moduleNames.join(', ') : 'No modules'}
            </p>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <AdminActionMenu
            items={[
              {
                label: 'View',
                icon: <HiOutlineEye className="size-4" />,
                onClick: () => {
                  setSelectedRoleName(row.original.name);
                  setIsDrawerOpen(true);
                },
              },
              {
                label: 'Edit',
                icon: <HiOutlinePencilSquare className="size-4" />,
                onClick: () => openEditModal(row.original),
              },
              {
                label: 'Delete',
                icon: <HiOutlineTrash className="size-4" />,
                tone: 'danger',
                onClick: () => {
                  void handleDeleteRole(row.original.name);
                },
              },
            ]}
          />
        ),
      },
    ],
    [selectedRole, form],
  );

  const rolePermissions = form.watch('permissions');

  const openCreateModal = () => {
    setModalMode('create');
    form.reset({
      name: '',
      is_active: true,
      permissions: [],
    });
    setIsModalOpen(true);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = {
      name: values.name,
      is_active: values.is_active,
      permissions: values.permissions,
    };

    if (modalMode === 'create') {
      const createdRole = await createRole(payload).unwrap();
      setSelectedRoleName(createdRole.name);
      setIsDrawerOpen(true);
    } else if (selectedRoleName) {
      await updateRole({
        name: selectedRoleName,
        body: payload,
      }).unwrap();
      setSelectedRoleName(values.name);
    }

    setIsModalOpen(false);
  });

  return (
    <AdminPageScaffold
      title="Roles"
      description="Create, update, and review the role definitions that power platform access and module-level permissions."
      actions={
        <SubmitButton type="button" text="Create Role" width="auto" onClick={openCreateModal} />
      }
    >
      <AdminDataTable
        columns={columns}
        data={data?.results ?? []}
        isLoading={isLoading}
        totalCount={data?.count ?? 0}
        page={page}
        onPageChange={setPage}
        emptyTitle="No roles found"
        emptyDescription="Create the first role to start assigning permissions."
      />

      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Role Detail"
        description="Inspect active state, module coverage, and the exact permissions attached to the selected role."
        actions={
          selectedRole ? (
            <>
              <SubmitButton
                type="button"
                text="Edit Role"
                width="auto"
                onClick={() => openEditModal()}
              />
              <SubmitButton
                type="button"
                text="Delete Role"
                width="auto"
                variant="base"
                loading={isDeletingRole}
                onClick={() => {
                  void handleDeleteRole();
                }}
              />
            </>
          ) : null
        }
      >
        {selectedRole ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cv-gray-300">
                Status
              </p>
              <div className="mt-3">
                <AdminStatusBadge status={selectedRole.is_active ? 'active' : 'inactive'} />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-cv-gray-400">
                Permissions
              </h3>
              {selectedRole.permissions.length ? (
                <div className="flex flex-wrap gap-2">
                  {selectedRole.permissions.map((permission) => (
                    <span
                      key={permission.code}
                      className="rounded-full border border-cv-gray-50 bg-cv-gray-10 px-3 py-1 text-xs font-semibold text-cv-gray-500"
                    >
                      {permission.module}: {permission.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-cv-gray-400">No permissions assigned.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-cv-gray-400">
            Choose a role from the table to open the detail drawer.
          </p>
        )}
      </AdminDrawer>

      <CvModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Create Role' : 'Edit Role'}
        size="xl"
      >
        <form className="grid gap-4" onSubmit={(event) => event.preventDefault()}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <CvInput label="Role Name" {...form.register('name')} />
              {form.formState.errors.name?.message ? (
                <ErrorLabel text={form.formState.errors.name.message} />
              ) : null}
            </div>
            <label className="flex items-center gap-3 rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3">
              <input
                type="checkbox"
                checked={form.watch('is_active')}
                onChange={(event) => form.setValue('is_active', event.target.checked)}
                className="size-4 rounded border-cv-gray-50"
              />
              <span className="text-sm font-semibold text-cv-gray-900">Role is active</span>
            </label>
          </div>

          <div className="grid gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-cv-gray-500">Permissions</p>
              <p className="text-sm text-cv-gray-400">
                Choose the permission codes that belong to this role.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {(modulesData?.results ?? []).map((module) => (
                <div
                  key={module.code}
                  className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-4"
                >
                  <h3 className="text-sm font-bold text-cv-gray-900">{module.name}</h3>
                  <p className="mt-1 text-xs text-cv-gray-400">{module.code}</p>
                  <div className="mt-4 grid gap-2">
                    {module.permissions.map((permission) => {
                      const isChecked = rolePermissions.includes(permission.code);

                      return (
                        <label key={permission.code} className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(event) => {
                              const nextPermissions = event.target.checked
                                ? [...rolePermissions, permission.code]
                                : rolePermissions.filter((code) => code !== permission.code);

                              form.setValue('permissions', nextPermissions, {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                            }}
                            className="mt-1 size-4 rounded border-cv-gray-50"
                          />
                          <div>
                            <p className="text-sm font-semibold text-cv-gray-900">
                              {permission.name}
                            </p>
                            <p className="text-xs text-cv-gray-400">{permission.code}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {form.formState.errors.permissions?.message ? (
              <ErrorLabel text={form.formState.errors.permissions.message} />
            ) : null}
          </div>

          <div className="flex justify-end gap-2">
            <SubmitButton
              type="button"
              text="Cancel"
              width="auto"
              variant="base"
              onClick={() => setIsModalOpen(false)}
            />
            <SubmitButton
              type="button"
              text={modalMode === 'create' ? 'Create Role' : 'Save Role'}
              width="auto"
              loading={isCreatingRole || isUpdatingRole}
              onClick={onSubmit}
            />
          </div>
        </form>
      </CvModal>
    </AdminPageScaffold>
  );
}
