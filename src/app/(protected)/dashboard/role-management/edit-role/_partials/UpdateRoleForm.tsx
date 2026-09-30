'use client';

import { CheckboxGroupField } from '@/components/forms/fields/CheckboxGroupField';
import { TextInputField } from '@/components/forms/fields/TextInputField';
import { ToggleSwitchField } from '@/components/forms/fields/ToggleSwitchField';
import { GenericForm } from '@/components/forms/GenericForm';
import { CTAButton } from '@/components/ui/CTAButton ';
import { PageHeader } from '@/components/ui/PageHeader';
import { SubmitButton } from '@/components/ui/SubmitButton';
import {
  useGetModulesQuery,
  useGetRoleQuery,
  useUpdateRoleMutation,
} from '@/features/role/rolesSlice';
import { cn } from '@/lib/twMerge';
import { capitalizeFirstLetter } from '@/utils/strings';
import { Alert, Skeleton } from '@mui/material';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { Toaster } from '../../../../../../components/ui/Toast';
import { PermissionCard, PermissionCardHeader } from '../../_components/PermissionCard';
import { CreateRoleSchema, CreateRoleType } from '../../create-role/_schemas/CreateRoleSchema';
import { useRouter } from '@bprogress/next';

export const UpdateRoleForm = () => {
  /**-Next Hooks-**/
  const { name } = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  /**-RTK-**/
  //queries
  const {
    data: roleData,
    isLoading: roleLoading,
    isError: roleError,
    error: roleErrorMessage,
  } = useGetRoleQuery(name as string);
  const {
    data: modulesData,
    isLoading: modulesLoading,
    error: modulesError,
  } = useGetModulesQuery();
  //mutations
  const [updateRole, { isLoading, isError, isSuccess }] = useUpdateRoleMutation();

  /**-UseMemos-**/
  const defaultValues: CreateRoleType = useMemo(() => {
    return {
      name: roleData?.name || '',
      permissions: [roleData?.permissions.map((permission) => permission.code) || []].flat(),
      is_active: roleData?.is_active || false,
    };
  }, [roleData, name]);

  /**-Event Handlers-**/
  const handleClick = () => {
    setOpen(true);
  };

  const handleUpdateRoleFormSubmit = async (
    formData: CreateRoleType | SubmitHandler<CreateRoleType>,
  ) => {
    if (!('permissions' in formData) || !('name' in formData) || !('is_active' in formData)) {
      return;
    }

    try {
      const response = await updateRole({
        name: name as string,
        body: { ...formData, is_active: formData.is_active },
      }).unwrap();

      if (response !== undefined) {
        router.push(`/dashboard/role-management`, { scroll: false });
        handleClick();
      }
    } catch (error) {
      console.error('Failed to create role:', error);
      handleClick();
    }
  };

  if (roleLoading || modulesLoading) {
    return (
      <div>
        <div className="mt-4">
          <Skeleton className="w-16" />
          <Skeleton className="w-full  py-4 px-3.5 rounded-md" />
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={index} className="w-full !h-50  rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (roleError || modulesError) {
    return <Alert severity="error">Error loading role: {String(roleErrorMessage)}</Alert>;
  }

  let message = '';
  if (isSuccess) {
    message = 'Role Update successfully!';
  } else if (isError) {
    message = 'Error Updating role. Please try again.';
  }

  return (
    <GenericForm
      schema={CreateRoleSchema}
      defaultValues={defaultValues}
      onSubmit={handleUpdateRoleFormSubmit}
    >
      <PageHeader
        title="Edit Role"
        subtitle="Modify the role and its permissions."
        rightSlot={
          <div>
            <ToggleSwitchField<CreateRoleType> name="is_active" />
          </div>
        }
      />

      <div className="mt-6">
        <TextInputField<CreateRoleType>
          name="name"
          label="Role Name"
          placeholder="Enter Role name"
          required
        />

        <div className="mt-6">
          <h1 className="text-[#2B3545] text-xl font-semibold">
            Permissions <span className="text-[#3AB134]">*</span>
          </h1>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {modulesData &&
              modulesData?.results?.map((module, index) => (
                <PermissionCard key={index}>
                  <PermissionCardHeader className="mb-2">
                    {capitalizeFirstLetter(module.name)}
                  </PermissionCardHeader>
                  <CheckboxGroupField<CreateRoleType>
                    name="permissions"
                    options={module.permissions.map((permission) => ({
                      text: permission.name,
                      value: permission.code,
                    }))}
                    required
                    showError={false}
                  />
                </PermissionCard>
              ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center border-t border-[#EAEBEC] pt-4 mt-6">
        <PermissionsError />
        <FormActionButtons isLoading={isLoading} />
      </div>

      <Toaster
        setOpen={setOpen}
        open={open}
        message={message}
        isError={isError}
        isSuccess={isSuccess}
      />
    </GenericForm>
  );
};

UpdateRoleForm.displayName = 'UpdateRoleForm';

const PermissionsError = () => {
  const {
    formState: { errors },
  } = useFormContext<{ permissions: string[] }>();

  return errors.permissions ? (
    <p className="mt-1 text-sm text-red-500">{errors.permissions.message}</p>
  ) : null;
};

PermissionsError.displayName = 'PermissionsError';

export const FormActionButtons = ({ isLoading }: { isLoading: boolean }) => {
  const {
    formState: { isDirty, isSubmitting },
    reset,
  } = useFormContext<CreateRoleType>();

  return (
    <div className="flex justify-end items-center gap-4 flex-1">
      <CTAButton
        role="button"
        variant="outline"
        width="auto"
        className={cn((!isDirty || isSubmitting) && 'opacity-50 cursor-not-allowed')}
        disabled={!isDirty || isSubmitting}
        onClick={() => reset()}
      >
        Cancel
      </CTAButton>
      <SubmitButton
        label="Update Role"
        loadingLabel="Updating..."
        width="auto"
        isLoading={isLoading}
      />
    </div>
  );
};

FormActionButtons.displayName = 'FormActionButtons';
