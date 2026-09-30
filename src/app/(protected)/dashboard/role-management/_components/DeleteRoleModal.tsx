'use client';
import { DeleteIcon } from '@/components/icons/DeleteIcon';
import { BaseModal } from '@/components/ui/BaseModal';
import { CTAButton } from '@/components/ui/CTAButton ';
import { LoadingActionButton } from '@/components/ui/LoadingActionButton';
import { useDeleteRoleMutation } from '@/features/role/rolesSlice';
import { X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export const DeleteRoleModal = ({
  open,
  onClose,
  name,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
}) => {
  const [deleteRoleMutation, { isLoading }] = useDeleteRoleMutation();
  const params = useParams();
  const router = useRouter();

  return (
    <BaseModal onClose={onClose} open={open} title="Delete Role" maxWidth={424}>
      <p>
        Are you sure you want to delete this role? This action cannot be undone and may affect users
        currently assigned to this role.
      </p>

      <div>
        <div className="flex gap-4 mt-9.25">
          <CTAButton type="button" variant="outline" onClick={onClose}>
            <X color="#2B3545" size={24} />
            Cancel
          </CTAButton>

          <LoadingActionButton
            variant="alert"
            label="Delete Role"
            loadingLabel="Deleting..."
            isLoading={isLoading}
            icon={<DeleteIcon width={24} height={24} />}
            onClick={async () => {
              const response = await deleteRoleMutation(name);

              if (response) {
                onClose();
                if (params.name) {
                  router.push(`/dashboard/role-management`);
                }
              }
            }}
          />
        </div>
      </div>
    </BaseModal>
  );
};

DeleteRoleModal.displayName = 'DeleteRoleModal';
