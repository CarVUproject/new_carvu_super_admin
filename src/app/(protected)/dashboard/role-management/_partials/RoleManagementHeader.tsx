'use client';
import { CTAButton } from '@/components/ui/CTAButton ';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchInputBox } from '@/components/ui/SearchInputBox';
import { useRouter } from '@bprogress/next';
import { Plus } from 'lucide-react';

export const RoleManagementHeader = () => {
  const router = useRouter();

  return (
    <PageHeader
      title="Role Management"
      subtitle="Manage user roles and permissions"
      rightSlot={
        <div className="flex items-center space-x-4">
          <SearchInputBox className="w-[386px] grow" iconClassName="w-6 h-6" />

          <CTAButton
            className="w-fit"
            onClick={() => router.push('/dashboard/role-management/create-role', { scroll: false })}
          >
            <Plus color="white" size={24} />
            Create Role
          </CTAButton>
        </div>
      }
    />
  );
};

RoleManagementHeader.displayName = 'RoleManagementHeader';
