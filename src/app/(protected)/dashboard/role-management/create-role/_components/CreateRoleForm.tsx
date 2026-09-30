'use client';

import { CheckboxGroupField } from '@/components/forms/fields/CheckboxGroupField';
import { TextInputField } from '@/components/forms/fields/TextInputField';
import { GenericForm } from '@/components/forms/GenericForm';
import { CTAButton } from '@/components/ui/CTAButton ';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { useCreateRoleMutation, useGetModulesQuery } from '@/features/role/rolesSlice';
import { cn } from '@/lib/twMerge';
import { capitalizeFirstLetter } from '@/utils/strings';
import { Alert, Skeleton } from '@mui/material';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { PermissionCard, PermissionCardHeader } from '../../_components/PermissionCard';
import { CreateRoleSchema, CreateRoleType } from '../_schemas/CreateRoleSchema';
import { toast } from 'react-toastify';
import { useRouter } from '@bprogress/next';

const defaultValues: CreateRoleType = {
  name: '',
  permissions: [],
  is_active: true,
};

export const CreateRoleForm = () => {
  /**-Next Hooks-**/
  const router = useRouter();

  /**-RTK-**/
  //queries
  const {
    data: modulesData,
    isLoading: modulesLoading,
    error: modulesError,
    isError: modulesIsError,
  } = useGetModulesQuery();
  //mutations
  const [createRole, { isLoading, error: createRoleError }] = useCreateRoleMutation();

  if (modulesLoading) {
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

  if (modulesIsError) {
    return <Alert severity="error">Error loading modules: {String(modulesError)}</Alert>;
  }

  const handleCreateRoleSubmit = async (data: CreateRoleType | SubmitHandler<CreateRoleType>) => {
    if (!('permissions' in data) || !('name' in data)) {
      return;
    }

    try {
      const response = await createRole({ ...data, is_active: true }).unwrap();
      if (response) {
        toast('New role created successfully', { type: 'success', autoClose: 400 });
        router.push('/dashboard/role-management');
      }
    } catch (error) {
      console.error('Failed to create role:', error);
      toast('Something went wrong, please try again later', { type: 'error' });
    }
  };

  return (
    <GenericForm
      schema={CreateRoleSchema}
      defaultValues={defaultValues}
      onSubmit={handleCreateRoleSubmit}
      apiError={createRoleError}
    >
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
              modulesData.results?.map((module, index) => (
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
    </GenericForm>
  );
};

CreateRoleForm.displayName = 'CreateRoleForm';

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
        onClick={() => reset({ name: '', permissions: [] })}
      >
        Cancel
      </CTAButton>
      <SubmitButton
        label="Create Role"
        loadingLabel="Creating..."
        width="auto"
        isLoading={isLoading}
      />
    </div>
  );
};

FormActionButtons.displayName = 'FormActionButtons';
