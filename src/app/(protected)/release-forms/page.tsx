import { FutureScopePage } from '@/components/admin/future/FutureScopePage';

export default function ReleaseFormsPage() {
  return (
    <FutureScopePage
      title="Release Forms"
      version="V2"
      description="Standalone release form lifecycle inspection is planned for V2."
      plannedScope={[
        'Release form list with status filters',
        'Order, buyer, and seller linkage',
        'PDF access where available',
      ]}
    />
  );
}
