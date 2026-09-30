import { DashboardContent } from '@/components/ui/DashboardContent';
import { DealerDetailsView } from './components/DealerDetailsView';

const page = async () => {
  return (
    <DashboardContent>
      <DealerDetailsView />
    </DashboardContent>
  );
};

export default page;
