import { DashboardContent } from '@/components/ui/DashboardContent';
import { PageHeader } from '@/components/ui/PageHeader';
import { CreateRoleForm } from './_components/CreateRoleForm';

const CreateRolePage = () => {
  return (
    <DashboardContent>
      <PageHeader title="Create Role" subtitle="Define a new role with custom permissions." />

      <CreateRoleForm />
    </DashboardContent>
  );
};

export default CreateRolePage;
