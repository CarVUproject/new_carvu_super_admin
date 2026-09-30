'use client';

import { AdminAuctionPage } from '@/components/admin/AdminAuctionPage';
import {
  useGetSuperAdminWholesaleAuctionQuery,
  useGetSuperAdminWholesaleAuctionsQuery,
} from '@/features/super-admin/superAdminApi';

export default function WholesaleAuctionsPage() {
  return (
    <AdminAuctionPage
      title="Wholesale Auctions"
      description="Inspect live and historical wholesale auction activity, bids, participants, seller context, timing, and outcomes."
      searchLabel="Search wholesale auctions"
      searchPlaceholder="Vehicle, VIN, seller, or winner"
      exportPath="super-admin/wholesale-auctions/export/"
      exportFilename="super-admin-wholesale-auctions.csv"
      emptyTitle="No wholesale auctions found"
      emptyDescription="Try adjusting the current wholesale auction filters."
      useListQuery={useGetSuperAdminWholesaleAuctionsQuery}
      useDetailQuery={useGetSuperAdminWholesaleAuctionQuery}
    />
  );
}
