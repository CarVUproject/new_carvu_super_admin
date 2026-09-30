'use client';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { ActionItem, ActionPopover } from '@/components/ui/ActionPopover';
import { HighlightBadge } from '@/components/ui/HighlightBadge';
import { useGetDealersQuery } from '@/features/dealer/dealerSlice';
import { dealerManagementHeaderConfig } from '@/mock_data/role-management-data';
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
import { EyeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MouseEvent, useState } from 'react';
import { DealerManagementModal } from './DealerManagementModal';
import { DeleteDealerModal } from './DeleteDealerModal';

export const DealerManagementTable = () => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<null | { id: string; status?: string }>(
    null,
  );
  const router = useRouter();
  const { data, isLoading, error, isError } = useGetDealersQuery();

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} className="w-full! py-5!" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <Alert severity="error">Error loading dealers: {error.toString()}</Alert>;
  }

  const transformDealerData = data?.results?.map((dealer) => ({
    ...dealer,
    listing: 0,
    sold: 0,
    sellRate: 0,
    lastActive: dealer?.user?.last_login
      ? new Date(dealer?.user?.last_login).toLocaleDateString()
      : 'N/A',
  }));

  const handleViewModalClose = (
    e: MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLSpanElement>,
  ) => {
    e.stopPropagation();
    setIsViewModalOpen(false);
    setSelectedDealer(null);
  };

  const handleViewClick = (
    e: MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLSpanElement>,
    data: { id: string; status: string },
  ) => {
    e.stopPropagation();
    setSelectedDealer({ ...data });
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (
    e: MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLSpanElement>,
    id: string,
  ) => {
    e.stopPropagation();
    setSelectedDealer({ id });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = (
    e: MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLSpanElement>,
  ) => {
    e.stopPropagation();
    setIsDeleteModalOpen(false);
    setSelectedDealer(null);
  };

  console.log('allDealers: ', transformDealerData);

  return (
    <div className="mt-6">
      <TableContainer component={Paper} className="!shadow-none">
        <Table className="w-full border-separate border-spacing-0">
          <TableHead>
            <TableRow>
              {dealerManagementHeaderConfig.map((header) => (
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
            {(transformDealerData ?? []).map((row, idx) => (
              <TableRow
                key={row.id}
                className={[
                  'hover:bg-gray-400/5',
                  idx % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]',
                  '!border-x-0 border-b border-[.82px] border-[#F3F4F6]',
                ].join(' ')}
              >
                <TableCell className="!border-0 !px-1 !py-4.5 !pl-2 !font-lato text-sm text-[#454545]">
                  <div
                    className="cursor-pointer"
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.stopPropagation();
                      handleViewClick(e, {
                        id: row.id.toString(),
                        status: row?.status,
                      });
                    }}
                  >
                    {row?.user?.full_name}
                  </div>
                </TableCell>
                <TableCell className="!border-0 !px-1 !py-4.5 !font-lato text-sm text-[#454545]">
                  <div className="w-full">
                    <p className="text-[#555D6A]">{row?.user?.email}</p>
                  </div>
                </TableCell>
                <TableCell className="!border-0 !px-1 !py-4.5 !font-lato text-sm text-[#454545]">
                  <p className="text-[#555D6A]">{row.listing}</p>
                </TableCell>
                <TableCell className="!border-0 !px-1 !py-4.5 !font-lato text-sm text-[#454545]">
                  <div className="w-full">
                    <p className="text-[#555D6A]">{row.sold}</p>
                  </div>
                </TableCell>
                <TableCell className="!border-0 !px-1 !py-4.5 !font-lato text-sm text-[#454545]">
                  <div className="w-full">
                    <p className="text-[#555D6A]">{row.sellRate}%</p>
                  </div>
                </TableCell>
                <TableCell className="!border-0 !px-1 !py-4.5 !font-lato text-sm text-[#454545]">
                  <div className="w-full">
                    <p className="text-[#555D6A]">{row.lastActive}</p>
                  </div>
                </TableCell>
                <TableCell className="!border-0 !px-1 !py-4.5 !font-lato text-sm text-[#454545]">
                  <div className="w-full">
                    <HighlightBadge label={row?.status} status={row?.status} />
                  </div>
                </TableCell>
                <TableCell className="!border-0 !px-1 !py-4.5 !font-lato text-sm text-[#454545]">
                  <div className="ml-5">
                    <DealerManagementModal
                      data={selectedDealer as { id: string; status: string }}
                      closeModal={handleViewModalClose}
                      open={isViewModalOpen}
                    />
                    <DeleteDealerModal
                      onClose={handleDeleteModalClose}
                      open={isDeleteModalOpen}
                      id={selectedDealer?.id || ''}
                    />

                    <ActionPopover>
                      <ActionItem
                        label="View"
                        icon={<EyeIcon size={16} />}
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                          e.stopPropagation();
                          router.push(`/dashboard/dealer-management/${row.id}`, { scroll: false });
                        }}
                      />
                      <ActionItem
                        label="Delete"
                        icon={<DeleteIcon color="#2B3545" height={16} width={16} />}
                        onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                          handleDeleteClick(e, row.id.toString())
                        }
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

DealerManagementTable.displayName = 'DealerManagementTable';
