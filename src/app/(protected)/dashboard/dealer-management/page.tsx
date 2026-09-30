import { DashboardContent } from '@/components/ui/DashboardContent';
import { StatsSection } from './_components/StatsSection';
import { DealerManagementHeader } from './_components/DealarManagementHeader';
import { DealerManagementTable } from './_components/DealerManagementTable';
import { CustomPagination } from '@/components/ui/pagination/CustomPagination';

const DealerManagementPage = () => {
  return (
    <div>
      <StatsSection />
      <DashboardContent>
        <DealerManagementHeader />
        <DealerManagementTable />
        <CustomPagination />
      </DashboardContent>
    </div>
  );
};

export default DealerManagementPage;
