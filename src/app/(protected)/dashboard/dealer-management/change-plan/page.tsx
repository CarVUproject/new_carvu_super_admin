import { DashboardContent } from '@/components/ui/DashboardContent';
import { ChangePlanHeader } from './_components/ChangePlanHeader';
import { PlanForm } from './_components/PlanForm';

const ChangePlanPage = () => {
  return (
    <DashboardContent>
      <ChangePlanHeader />
      <PlanForm />
    </DashboardContent>
  );
};

export default ChangePlanPage;

ChangePlanPage.displayName = 'ChangePlanPage';
