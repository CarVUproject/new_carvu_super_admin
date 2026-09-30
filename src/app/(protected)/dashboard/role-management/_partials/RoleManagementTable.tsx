'use client';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { ActionItem, ActionPopover } from '@/components/ui/ActionPopover';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { useGetRolesQuery } from '@/features/role/rolesSlice';
import { headerConfig } from '@/mock_data/role-management-data';
import {
  Alert,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Edit2Icon, EyeIcon } from 'lucide-react';
import Link from 'next/link';
import { MouseEvent, useState } from 'react';
import { DeleteRoleModal } from '../_components/DeleteRoleModal';
import { useRouter } from '@bprogress/next';

export const RoleManagementTable = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetRolesQuery();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const rolesData = data || [];

  if (isError) return <Alert severity="error">Error fetching roles data</Alert>;

  if (isLoading) return <TableSkeleton />;

  const handleDeleteModal = (
    e: MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLSpanElement>,
    name: string,
  ) => {
    e.stopPropagation();
    setSelectedRole(name);
    setDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setDeleteModalOpen(false);
    setSelectedRole(null);
  };

  return (
    <div className="mt-6">
      <TableContainer component={Paper} className="!shadow-none">
        <Table className="w-full border-separate border-spacing-0">
          <TableHead>
            <TableRow>
              {headerConfig.map((header) => (
                <TableCell
                  key={header.key}
                  className="border-y-[.82px] border-[#EAEBEC] !bg-[#F3F4F5] px-[9.78px] py-[8.94px] !text-start !font-lato !text-sm !font-semibold !text-[#717882]"
                >
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rolesData.map((row, idx) => (
              <TableRow
                key={row.name}
                className={[
                  idx % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]',
                  '!border-x-0 border-b border-[.82px] border-[#F3F4F6]',
                ].join(' ')}
              >
                <TableCell className="!border-0 !px-1 !py-4.5 !pl-2 !font-lato text-sm text-[#454545]">
                  <Link
                    href={{
                      pathname: `/dashboard/role-management/role-details/${row.name}`,
                    }}
                    className="hover:text-blue-500 hover:underline"
                  >
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell className="w-1/2 !border-0 !px-1 !py-4.5 !font-lato text-sm text-[#454545]">
                  <div className="w-full">
                    <p className="text-[#555D6A]">
                      {row?.permissions?.map((permission: any) => permission.module).join(', ')}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="!border-0 !px-1 !py-4.5 !font-lato text-sm text-[#454545]">
                  <ToggleSwitch checked={row.is_active} readOnly />
                </TableCell>
                <TableCell className="!border-0 !px-1 !py-4.5 !font-lato text-sm text-[#454545]">
                  <div className="text-center">
                    <ActionPopover>
                      <ActionItem
                        label="View"
                        icon={<EyeIcon size={16} />}
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                          e.stopPropagation();
                          router.push(`/dashboard/role-management/role-details/${row.name}`, {
                            scroll: false,
                          });
                        }}
                      />
                      <ActionItem
                        label="Edit"
                        icon={<Edit2Icon color="#2B3545" height={16} width={16} />}
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                          e.stopPropagation();
                          router.push(`/dashboard/role-management/edit-role/${row.name}`, {
                            scroll: false,
                          });
                        }}
                      />

                      <ActionItem
                        label="Delete"
                        icon={<DeleteIcon color="#2B3545" height={16} width={16} />}
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                          handleDeleteModal(e, row.name);
                        }}
                      />
                      <DeleteRoleModal
                        open={deleteModalOpen}
                        onClose={handleCloseModal}
                        name={selectedRole ?? ''}
                      />
                    </ActionPopover>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

RoleManagementTable.displayName = 'RoleManagementTable';

export const TableSkeleton = () => {
  return (
    <div>
      <Skeleton className="py-4.75" />

      {Array.from({ length: 10 }).map((_, colIndex) => (
        <Skeleton key={colIndex} className=" py-8" />
      ))}
    </div>
  );
};
TableSkeleton.displayName = 'TableSkeleton';
