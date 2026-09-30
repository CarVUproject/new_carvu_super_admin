import { BaseModal } from '@/components/ui/BaseModal';
import { CTAButton } from '@/components/ui/CTAButton ';
import { LoadingActionButton } from '@/components/ui/LoadingActionButton';
import { useUpdateDealerMutation } from '@/features/dealer/dealerSlice';
import { Check, X } from 'lucide-react';
import { toast } from 'react-toastify';

interface DealerApproverModalProps {
  onClose: () => void;
  open: boolean;
  dealerId: string;
}
export const DealerApproverModal = ({ onClose, open, dealerId }: DealerApproverModalProps) => {
  /**-RTK-**/
  //mutation
  const [updateDealer, { isLoading: updateDealerLoading }] = useUpdateDealerMutation();

  const handleApproverMutation = async () => {
    try {
      const updatedDealer = await updateDealer({
        id: dealerId,
        body: { status: 'approved' },
      }).unwrap();
      if (updatedDealer) {
        toast('Updated successfully', { type: 'success' });
        onClose();
      }
    } catch (error) {
      console.log('Dealer Update Error: ', error);
      toast('Something went wrong, please try again later.', { type: 'error' });
    }
  };

  return (
    <BaseModal onClose={onClose} open={open} title="Approve Dealer" maxWidth={424}>
      <div className="space-y-4">
        <p>
          You are about to approve this dealer’s request. Once approved, the dealer will receive
          access to their dashboard and can begin listing vehicles, managing reports, and
          participating in auctions.
        </p>

        <div className="flex gap-4 mt-9.25">
          <CTAButton type="button" variant="outline" onClick={onClose}>
            <X color="#2B3545" size={24} />
            Cancel
          </CTAButton>

          <LoadingActionButton
            onClick={handleApproverMutation}
            label="Confirm"
            loadingLabel="Confirming..."
            isLoading={updateDealerLoading}
            icon={<Check size={24} color="white" />}
          />
        </div>
      </div>
    </BaseModal>
  );
};

DealerApproverModal.displayName = 'DealerApproverModal';
