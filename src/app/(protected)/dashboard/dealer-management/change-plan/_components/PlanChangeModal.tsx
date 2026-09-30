import { BaseModal } from '@/components/ui/BaseModal';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { PlanType } from './PlanForm';

interface planChangeModalProps {
  open: boolean;
  closeModal: () => void;
  isLoading: boolean;
  onConfirm?: (value?: any) => void;
  previousPlan: PlanType['plan'] | undefined;
  currentPlan: PlanType['plan'] | undefined;
}

export const PlanChangeModal = ({
  open,
  closeModal,
  isLoading,
  onConfirm,
  previousPlan,
  currentPlan,
}: planChangeModalProps) => {
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <BaseModal
      open={open}
      onClose={closeModal}
      title="Confirm Subscription Plan Change"
      maxWidth="424px"
    >
      <div className="">
        <p className="text-base/5.5 text-[#9DA2A9]">
          You&apos;re about to change the dealer&apos;s subscription plan from
          <span className="text-[#27303F] font-semibold"> {previousPlan}</span> to
          <span className="text-[#27303F] font-semibold"> {currentPlan}</span>.
        </p>

        <div className="mt-9 flex gap-3">
          <button type="button" className="btn-base w-full" onClick={closeModal}>
            Cancel
          </button>
          <SubmitButton
            label="Change Plan"
            loadingLabel="Changing Plan"
            className="btn-gradient w-full  py-2! px-4!"
            isLoading={isLoading}
            onClick={handleConfirm}
          />
        </div>
      </div>
    </BaseModal>
  );
};

PlanChangeModal.displayName = 'PlanChangeModal';
