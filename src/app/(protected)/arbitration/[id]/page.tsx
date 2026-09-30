import { ArbitrationCaseDetailView } from './_partials/ArbitrationCaseDetailView';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ArbitrationDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <ArbitrationCaseDetailView id={id} />;
}
