import { AdminPageScaffold, AdminSectionCard } from '@/components/admin/AdminPageScaffold';

type FutureScopePageProps = {
  title: string;
  version: 'V2' | 'V3';
  description: string;
  plannedScope: string[];
};

export function FutureScopePage({
  title,
  version,
  description,
  plannedScope,
}: FutureScopePageProps) {
  return (
    <AdminPageScaffold title={title} eyebrow={`Planned ${version}`} description={description}>
      <AdminSectionCard
        title={`${version} Scope`}
        description="This placeholder is intentionally visible in the sidebar so the roadmap is clear without mixing future work into the V1 release."
      >
        <ul className="grid gap-3">
          {plannedScope.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-cv-gray-50 bg-cv-gray-10 px-4 py-3 text-sm font-semibold text-cv-gray-600"
            >
              {item}
            </li>
          ))}
        </ul>
      </AdminSectionCard>
    </AdminPageScaffold>
  );
}
