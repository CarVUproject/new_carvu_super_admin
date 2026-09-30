import { TextAreaInputField } from '@/components/forms/fields/TextAreaInputField';
import { GenericForm } from '@/components/forms/GenericForm';
import { BaseModal } from '@/components/ui/BaseModal';
import { CTAButton } from '@/components/ui/CTAButton ';
import { LoadingActionButton } from '@/components/ui/LoadingActionButton';
import { useUpdateDealerMutation } from '@/features/dealer/dealerSlice';
import { X } from 'lucide-react';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import z from 'zod';

export const RejectFormSchema = z.object({
  reason: z
    .string()
    .transform((val) => val.trim())
    .refine((val) => val.length > 0, { message: 'Reject reason is required' }),
});

type RejectFormType = z.infer<typeof RejectFormSchema>;

interface DealerRejectModalProps {
  onClose: () => void;
  open: boolean;
  dealerId: string;
}
export const DealerRejectModal = ({ onClose, open, dealerId }: DealerRejectModalProps) => {
  /**-RTK-**/
  //mutation
  const [updateDealer, { isLoading: updateDealerLoading }] = useUpdateDealerMutation();

  /**-Event Handlers-* */
  const handleRejectFormSubmit = async (data: RejectFormType | SubmitHandler<HTMLFormElement>) => {
    try {
      const updatedDealer = await updateDealer({
        id: dealerId,
        body: { status: 'rejected' },
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
    <BaseModal onClose={onClose} open={open} title="Reject Dealer" maxWidth={424}>
      <div className="space-y-4">
        <p>
          Please provide a reason for rejecting this dealer. The dealer will be notified via email
          and will not be granted access to the platform.
        </p>

        <div>
          <GenericForm
            schema={RejectFormSchema}
            defaultValues={{ reason: '' }}
            onSubmit={handleRejectFormSubmit}
          >
            <TextAreaInputField<RejectFormType> name="reason" label="Reason" required />

            <div className="flex gap-4 mt-9.25">
              <CTAButton type="button" variant="outline" onClick={onClose}>
                <X color="#2B3545" size={24} />
                Cancel
              </CTAButton>

              <LoadingActionButton
                variant="alert"
                label="Reject Dealer"
                loadingLabel="Rejecting..."
                isLoading={updateDealerLoading}
                icon={<X />}
              />
            </div>
          </GenericForm>
        </div>
      </div>
    </BaseModal>
  );
};

DealerRejectModal.displayName = 'DealerRejectModal';
