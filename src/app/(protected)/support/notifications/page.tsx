import { FutureScopePage } from '@/components/admin/future/FutureScopePage';

export default function NotificationsPage() {
  return (
    <FutureScopePage
      title="Notifications"
      version="V2"
      description="Notification delivery inspection is planned for the V2 support expansion."
      plannedScope={[
        'Notification list',
        'User linkage and notification type',
        'Read and unread state visibility',
      ]}
    />
  );
}
