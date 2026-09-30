import { PageHeader } from '@/components/ui/PageHeader';
import { PlanToggleTab } from './PlanToggleTab';

export const ChangePlanHeader = () => {
  return (
    <div>
      <PageHeader
        title="Change Subscription Plan"
        rightSlot={
          <div>
            <PlanToggleTab />
          </div>
        }
      />
    </div>
  );
};

ChangePlanHeader.displayName = 'ChangePlanHeader';
