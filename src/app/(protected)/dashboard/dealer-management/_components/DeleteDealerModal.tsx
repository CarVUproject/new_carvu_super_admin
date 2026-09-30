'use client';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { BaseModal } from '@/components/ui/BaseModal';
import { CTAButton } from '@/components/ui/CTAButton ';
import { LoadingActionButton } from '@/components/ui/LoadingActionButton';
import { useDeleteDealerMutation } from '@/features/dealer/dealerSlice';
import { X } from 'lucide-react';
import { MouseEvent } from 'react';
import { toast } from 'react-toastify';

interface DeleteDealerModalProps {
  onClose: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLSpanElement>) => void;
  open: boolean;
  id: string;
}
export const DeleteDealerModal = ({ id, onClose, open }: DeleteDealerModalProps) => {
  const [deleteDealerMutation, { isLoading }] = useDeleteDealerMutation();

  const handleApiCalling = async (
    e: MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLSpanElement>,
  ) => {
    e.stopPropagation();

    try {
      const response = await deleteDealerMutation(id);
      console.log('Delete response:', response);

      if (response.data !== undefined) {
        onClose(e);
        toast.success('Dealer deleted successfully.');
      }
    } catch (error) {
      console.log('Delete error:', error);
      toast.error('Failed to delete dealer. Please try again.');
    }
  };

  return (
    <BaseModal onClose={onClose} open={open} title="Delete Dealer" maxWidth="424px">
      <div className="space-y-4">
        <p className="text-base/5.5 text-[#9DA2A9]">
          Are you sure you want to permanently delete this dealer account? This action cannot be
          undone and will result in the following:
        </p>
        <ul className="list-disc ml-8">
          <li className="text-base/5.5 text-[#2B3545]">
            All vehicle listings, reports, and auction data will be removed.
          </li>
          <li className="text-base/5.5 text-[#2B3545]">
            The dealer will lose access to their dashboard immediately.
          </li>
          <li className="text-base/5.5 text-[#2B3545]">
            Associated subscriptions and purchase history will be deleted.
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 mt-9.25">
        <CTAButton onClick={(e: MouseEvent<HTMLButtonElement>) => onClose(e)} variant="outline">
          <X color="#2B3545" size={24} />
          Cancel
        </CTAButton>

        <LoadingActionButton
          onClick={handleApiCalling}
          label="Delete"
          icon={<DeleteIcon color="white" width={24} height={24} />}
          loadingLabel="Deleting..."
          variant="alert"
          isLoading={isLoading}
        />
      </div>
    </BaseModal>
  );
};

DeleteDealerModal.displayName = 'DeleteDealerModal';
