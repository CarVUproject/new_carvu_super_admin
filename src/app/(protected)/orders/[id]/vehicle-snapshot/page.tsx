import { OrderVehicleSnapshotView } from './_partials/OrderVehicleSnapshotView';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderVehicleSnapshotPage({ params }: Props) {
  const { id } = await params;

  return <OrderVehicleSnapshotView orderId={id} />;
}
