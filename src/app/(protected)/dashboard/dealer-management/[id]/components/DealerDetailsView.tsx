'use client';

import { CTAButton } from '@/components/ui/CTAButton ';
import { PageHeader } from '@/components/ui/PageHeader';
import { useGetDealerQuery, useUpdateDealerMutation } from '@/features/dealer/dealerSlice';
import { Alert } from '@mui/material';
import { Check, X } from 'lucide-react';
import { useState } from 'react';
import { DealerApproverModal } from '../../_components/DealerApproverModal';
import { DealerRejectModal } from '../../_components/DealerRejectModal';
import { DealerPersonalInfo } from '../_partials/DealerPersonalInfo';
import { DealershipInfo } from '../_partials/DealershipInfo';
import { DocumentAsDealer } from '../_partials/DocumentAsDealer';
import { PaymentInfo } from '../_partials/PaymentInfo';
import { StatsSection } from '../_partials/StatsSection';
import { SubscriptionAndBilling } from '../_partials/SubscriptionAndBilling';
import { AddressInfo } from './AddressInfo';
import { DealerDetailsSkeleton } from './DealerDetailsSkeleton';
import { useParams } from 'next/navigation';

export const DealerDetailsView = () => {
  /**-Next Hooks-**/
  const { id } = useParams();
  const [modalOpen, setModalOpen] = useState<'approval' | 'rejection' | null>(null);

  /**-RTK-**/
  //queries
  const { data, isLoading, isError, error } = useGetDealerQuery(id as string);

  console.log('dealerData', data);

  if (isLoading) {
    return <DealerDetailsSkeleton />;
  }

  if (isError) {
    return <Alert severity="error">Error loading dealer details: {error.toString()}</Alert>;
  }

  return (
    <div>
      <PageHeader
        title="Dealer Details View"
        rightSlot={
          <>
            {data?.status === 'pending' && (
              <div className="flex gap-4">
                <DealerApproverModal
                  onClose={() => setModalOpen(null)}
                  open={modalOpen === 'approval'}
                  dealerId={id as string}
                />

                <DealerRejectModal
                  onClose={() => setModalOpen(null)}
                  open={modalOpen === 'rejection'}
                  dealerId={id as string}
                />

                <CTAButton
                  size="sm"
                  variant="alert"
                  className="border-[#FFEBEB]"
                  onClick={() => setModalOpen('rejection')}
                >
                  <X size={20} /> Reject
                </CTAButton>
                <CTAButton size="sm" onClick={() => setModalOpen('approval')}>
                  <Check size={20} color="white" /> Approved
                </CTAButton>
              </div>
            )}
          </>
        }
      />
      <div className="space-y-4 mt-4">
        {/* Dealer Personal Information */}
        <DealerPersonalInfo
          imgUrl={data?.user?.avatar || '/assets/images/placeholder-user.png'}
          name={data?.user?.full_name || ''}
          position="Owner "
          email={data?.user?.email || ''}
          businessPhone={data?.user?.phone || ''}
          status={data?.status || ''}
        />

        {/* Statistic Section */}
        <StatsSection />

        {/* Dealership information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DealershipInfo dealershipInfo={data || {}} />
          <SubscriptionAndBilling activeSince="N/A" nextBilling="N/A" />
        </div>

        {/* Addresses */}
        <div className="space-y-4">
          <AddressInfo
            title="Primary Address"
            address="1600 Amphitheatre Parkway, Mountain View, California, 94043, United States"
          />

          <AddressInfo
            title="Shipping Address"
            addresses={[
              '1600 Amphitheatre Parkway, Mountain View, California, 94043, United States',
              '1600 Amphitheatre Parkway, Mountain View, California, 94043, United States',
            ]}
          />
          <AddressInfo
            title="Billing Address"
            addresses={[
              '1600 Amphitheatre Parkway, Mountain View, California, 94043, United States',
              '1600 Amphitheatre Parkway, Mountain View, California, 94043, United States',
            ]}
          />
        </div>

        {/* Document Dealer */}
        <DocumentAsDealer />

        {/* Payment Info */}
        <PaymentInfo />
      </div>
    </div>
  );
};
