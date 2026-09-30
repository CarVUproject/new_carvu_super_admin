import { DashboardContent } from '@/components/ui/DashboardContent';
import { RoleManagementHeader } from './_partials/RoleManagementHeader';
import { RoleManagementTable } from './_partials/RoleManagementTable';

const RoleManagementPage = () => {
  return (
    <DashboardContent>
      <RoleManagementHeader />
      <RoleManagementTable />
    </DashboardContent>
  );
};

export default RoleManagementPage;
