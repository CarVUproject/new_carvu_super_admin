'use client';

import { AdminAuctionPage } from '@/components/admin/AdminAuctionPage';
import {
  useGetSuperAdminPublicAuctionQuery,
  useGetSuperAdminPublicAuctionsQuery,
} from '@/features/super-admin/superAdminApi';

export default function PublicAuctionsPage() {
  return (
    <AdminAuctionPage
      title="Public Auctions"
      description="Inspect live and historical public auction activity, bids, participants, vehicle linkage, timing, and outcomes."
      searchLabel="Search public auctions"
      searchPlaceholder="Vehicle, VIN, seller, or winner"
      exportPath="super-admin/public-auctions/export/"
      exportFilename="super-admin-public-auctions.csv"
      emptyTitle="No public auctions found"
      emptyDescription="Try adjusting the current public auction filters."
      useListQuery={useGetSuperAdminPublicAuctionsQuery}
      useDetailQuery={useGetSuperAdminPublicAuctionQuery}
    />
  );
}
