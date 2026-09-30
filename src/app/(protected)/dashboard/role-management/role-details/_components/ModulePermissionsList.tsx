'use client';
import { cn } from '@/lib/twMerge';
import { capitalizeFirstLetter } from '@/utils/strings';
import { PermissionCard, PermissionCardHeader } from '../../_components/PermissionCard';

interface ModulePermissionsListProps {
  permissions: {
    module: string;
    code: string;
    name: string;
  }[];
}

export const ModulePermissionsList = ({ permissions }: ModulePermissionsListProps) => {
  const moduleMap: Record<string, { code: string; name: string }[]> = {};

  permissions?.forEach(({ module, code, name }) => {
    if (!moduleMap[module]) {
      moduleMap[module] = [];
    }
    moduleMap[module].push({ code, name });
  });

  // Convert map to array
  const modulesArray = Object.keys(moduleMap).map((module) => ({
    module,
    permissions: moduleMap[module],
  }));

  return (
    <div className="mt-6 select-none">
      <h1 className="text-[#2B3545] text-xl font-semibold">
        Permissions <span className="text-[#3AB134]">*</span>
      </h1>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {modulesArray?.map(({ module, permissions }) => (
          <PermissionCard key={module}>
            <PermissionCardHeader>{capitalizeFirstLetter(module)}</PermissionCardHeader>
            <div className="mt-2">
              {permissions.map((permission, index) => (
                <span
                  key={index}
                  className={cn('text-[#2B3545] text-base', index > 0 && 'ml-1.25')}
                >
                  {capitalizeFirstLetter(permission.name)}
                  {index < permissions.length - 1 && ','}
                </span>
              ))}
            </div>
          </PermissionCard>
        ))}
      </div>
    </div>
  );
};

ModulePermissionsList.displayName = 'ModulePermissionsList';
