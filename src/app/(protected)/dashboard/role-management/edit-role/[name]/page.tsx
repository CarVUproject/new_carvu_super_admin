import { DashboardContent } from '@/components/ui/DashboardContent';
import { UpdateRoleForm } from '../_partials/UpdateRoleForm';

const EditRolePage = async () => {
  return (
    <div>
      <DashboardContent>
        <UpdateRoleForm />
      </DashboardContent>
    </div>
  );
};

export default EditRolePage;
