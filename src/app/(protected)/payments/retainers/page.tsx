import { FutureScopePage } from '@/components/admin/future/FutureScopePage';

export default function RetainersPage() {
  return (
    <FutureScopePage
      title="Retainers"
      version="V2"
      description="Dedicated retainer operations are not part of V1. V1 only exposes retainer visibility through Orders and Financial Reports."
      plannedScope={[
        'Retainer payment health and failure diagnostics',
        'Failure-rate trends inside richer financial reporting',
        'Operational follow-up tooling once retainer workflows are finalized',
      ]}
    />
  );
}
