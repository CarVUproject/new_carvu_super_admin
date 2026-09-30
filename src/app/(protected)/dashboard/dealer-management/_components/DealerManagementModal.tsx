'use client';
import { BaseModal } from '@/components/ui/BaseModal';
import { CTAButton } from '@/components/ui/CTAButton ';
import { HighlightBadge } from '@/components/ui/HighlightBadge';
import { ActivitySquare, Check, Eye, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MouseEvent, useState } from 'react';
import { BoxCard, BoxCardSeparator, BoxCardTitle } from './BoxCard';
import { DealerApproverModal } from './DealerApproverModal';
import { DealerModalInfo } from './DealerModalInfo';
import { DealerRejectModal } from './DealerRejectModal';
import { DocumentCard } from './DocumentCard';

const FILES = [
  {
    name: 'Dealer License Document.pdf',
    icon: '/assets/images/icon-pdf.png',
    fileType: 'pdf',
    size: 94,
  },
  {
    name: 'Dealer License Document.pdf',
    icon: '/assets/images/icon-pdf.png',
    fileType: 'pdf',
    size: 93,
  },
  {
    name: 'Dealer License Document.pdf',
    icon: '/assets/images/icon-pdf.png',
    fileType: 'pdf',
    size: 92,
  },
  {
    name: 'Dealer License Document.jpg',
    icon: '/assets/images/jpg-icon.png',
    fileType: 'pdf',
    size: 90,
  },
  {
    name: 'Dealer License Document.jpg',
    icon: '/assets/images/jpg-icon.png',
    fileType: 'pdf',
    size: 94,
  },
];

interface DealerManagementModalProps {
  closeModal: (e: MouseEvent<HTMLDivElement>) => void;
  open: boolean;
  data: { id: string; status: string };
}

export const DealerManagementModal = ({ closeModal, open, data }: DealerManagementModalProps) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isApproverModalOpen, setIsApproverModalOpen] = useState(false);
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/dashboard/dealer-management/${data?.id}`, { scroll: false });
  };

  const handleRejectClick = () => {
    setIsRejectModalOpen(true);
  };

  const handleRejectModalClose = () => {
    setIsRejectModalOpen(false);
  };

  return (
    <BaseModal
      title="Dealer Information"
      onClose={(e: MouseEvent<HTMLDivElement>) => closeModal(e)}
      open={open}
    >
      <div className="space-y-4">
        <BoxCard>
          <div className="flex gap-4">
            <div className="space-y-3">
              <div>
                <Image
                  src="/assets/images/dealer-img.jpg"
                  width={96}
                  height={96}
                  alt="dealer img"
                  className="rounded-xl"
                />
              </div>

              <HighlightBadge label="Pending" status="pending" className="w-full" />
            </div>

            <div>
              <DealerModalInfo
                name="John doe"
                position="Owner"
                email="example@gmail.com"
                businessPhone="+1 (555) 000-0000"
                dealerClass="General Dealer (G)"
              />
            </div>
          </div>
        </BoxCard>
        <BoxCard>
          <BoxCardTitle>Documents as a Dealer</BoxCardTitle>
          <BoxCardSeparator />
          <div className="grid grid-cols-2 gap-5">
            {FILES?.map((file, idx) => (
              <DocumentCard key={idx} {...file} />
            ))}
          </div>
        </BoxCard>

        {data?.status === 'pending' && (
          <div>
            <DealerRejectModal
              onClose={handleRejectModalClose}
              open={isRejectModalOpen}
              dealerId={data?.id}
            />

            <DealerApproverModal
              onClose={() => setIsApproverModalOpen(false)}
              open={isApproverModalOpen}
              dealerId={data?.id}
            />

            {/* Buttons */}
            <div className="flex justify-between items-center gap-3">
              <CTAButton variant="outline" className="border-[#FFEBEB]" onClick={handleRejectClick}>
                <X size={24} color="#FF2626" />
                Reject
              </CTAButton>
              <CTAButton variant="outline" onClick={handleViewDetails}>
                <Eye size={24} color="#2B3545" />
                View Details
              </CTAButton>
              <CTAButton onClick={() => setIsApproverModalOpen(true)}>
                <Check size={24} color="white" /> Approved
              </CTAButton>
            </div>
          </div>
        )}

        {data?.status === 'approved' && (
          <div className="flex items-center gap-4">
            <CTAButton variant="outline" onClick={handleViewDetails}>
              <Eye size={24} color="#2B3545" />
              View Details
            </CTAButton>
            <CTAButton variant="alert" onClick={handleRejectClick}>
              <ActivitySquare size={24} color="white" />
              Deactivate
            </CTAButton>
          </div>
        )}

        {data?.status === 'active' && (
          <div className="flex items-center gap-4">
            <CTAButton variant="outline" onClick={handleViewDetails}>
              <Eye size={24} color="#2B3545" />
              View Details
            </CTAButton>
            <CTAButton>
              <ActivitySquare size={24} color="white" />
              Deactivate
            </CTAButton>
          </div>
        )}
      </div>
    </BaseModal>
  );
};

DealerManagementModal.displayName = 'DealerManagementModal';
