'use client';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { PageHeader } from '@/components/ui/PageHeader';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { useGetRoleQuery } from '@/features/role/rolesSlice';
import { Alert, Skeleton } from '@mui/material';
import { PencilLine } from 'lucide-react';
import { useParams } from 'next/navigation';
import { DisplayField } from '../../_components/DisplayField';
import { ModulePermissionsList } from '../_components/ModulePermissionsList';
import { useState } from 'react';
import { DeleteRoleModal } from '../../_components/DeleteRoleModal';
import { useRouter } from '@bprogress/next';

export const RoleDetails = () => {
  /**-Next Hooks-**/
  const { name } = useParams();
  const router = useRouter();
  const [isDeleteModalOpen, setIsModalOpen] = useState(false);

  /**-RTK-**/
  //queries
  const { data, isLoading, isError, error } = useGetRoleQuery(name as string);

  if (isError) {
    return (
      <Alert severity="error">
        Error fetching role details: {(error as any)?.data?.message || 'Something went wrong.'}
      </Alert>
    );
  }

  return (
    <>
      <PageHeader
        title="Role & Details"
        subtitle="View and edit role information with assigned permissions."
        rightSlot={
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="flex gap-2">
                <Skeleton className="!w-16 !h-12" />
                <Skeleton className="!w-16 !h-12" />
                <Skeleton className="!w-16 !h-12" />
              </div>
            ) : (
              <>
                <div
                  className="group cursor-pointer h-[30px] w-[30px] rounded-full grid place-items-center hover:bg-zinc-200 transition-all duration-300"
                  onClick={() => setIsModalOpen(true)}
                >
                  <DeleteIcon
                    width={24}
                    height={24}
                    color="#1F2631"
                    className="group-hover:scale-75 transition-all duration-300"
                  />
                </div>
                <div
                  className="group cursor-pointer h-[30px] w-[30px] rounded-full grid place-items-center hover:bg-zinc-200 transition-all duration-300"
                  onClick={() => router.push(`/dashboard/role-management/edit-role/${data?.name}`)}
                >
                  <PencilLine
                    size={20}
                    color="#1F2631"
                    className="group-hover:scale-75 transition-all duration-300"
                  />
                </div>
                <div>
                  <ToggleSwitch
                    checked={data?.is_active}
                    readOnly
                    style={{ cursor: 'not-allowed' }}
                  />
                </div>
              </>
            )}
          </div>
        }
      />

      {isLoading ? (
        <div>
          <Skeleton className="mt-4 !h-16 !rounded-xl" />
          <div className="grid grid-cols-2 gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="mt-4 !h-32 !rounded-xl" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <DisplayField label="Role Name" required value={data?.name ?? ''} />
          <ModulePermissionsList permissions={data?.permissions ?? []} />
        </>
      )}

      <DeleteRoleModal
        open={isDeleteModalOpen}
        onClose={() => setIsModalOpen(false)}
        name={name as string}
      />
    </>
  );
};

RoleDetails.displayName = 'RoleDetails';
