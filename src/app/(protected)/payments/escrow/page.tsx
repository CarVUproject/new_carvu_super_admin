import { FutureScopePage } from '@/components/admin/future/FutureScopePage';

export default function EscrowPage() {
  return (
    <FutureScopePage
      title="Escrow"
      version="V3"
      description="Full escrow management is outside V1 and V2. It belongs to the dedicated V3 escrow program because it affects backend, user-facing flows, and super admin operations together."
      plannedScope={[
        'Escrow list and case review',
        'Escrow lifecycle transitions and timeline',
        'Admin actions after escrow business rules are aligned',
      ]}
    />
  );
}
