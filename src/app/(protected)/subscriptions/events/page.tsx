import { FutureScopePage } from '@/components/admin/future/FutureScopePage';

export default function SubscriptionEventsPage() {
  return (
    <FutureScopePage
      title="Subscription Events"
      version="V2"
      description="Stripe webhook and subscription sync diagnostics are planned for V2."
      plannedScope={[
        'Event list with type and processed-state filters',
        'Stripe event ID visibility',
        'Payload inspection for diagnostics',
      ]}
    />
  );
}
