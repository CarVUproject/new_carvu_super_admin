import { CTAButton } from '@/components/ui/CTAButton ';
import { HighlightBadge } from '@/components/ui/HighlightBadge';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { BoxCard, BoxCardSeparator, BoxCardTitle } from '../../_components/BoxCard';

export const SubscriptionAndBilling = ({
  activeSince,
  nextBilling,
}: {
  activeSince: string;
  nextBilling: string;
}) => {
  return (
    <BoxCard>
      <div className="flex items-center justify-between">
        <BoxCardTitle>Current Subscription & Billing</BoxCardTitle>
        <CTAButton
          width="auto"
          variant="outline"
          size="sm"
          className="border-[#B0BBD1] text-[#088F01]"
        >
          All Invoices <ArrowRight />
        </CTAButton>
      </div>
      <BoxCardSeparator />

      <BoxCard className="p-0!">
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xl/7 text-[#27303F] font-semibold">N/A</h4>
            <HighlightBadge label="N/A" status="approved" />
          </div>
          <div className="space-y-1 mt-3">
            <p className="text-sm/4.5 text-[#9DA2A9]">
              Active since <span className="text-[#555D6A]">{activeSince ?? 'N/A'}</span>
            </p>
            <p className="text-sm/4.5 text-[#9DA2A9]">
              Next billing <span className="text-[#555D6A]">{nextBilling ?? 'N/A'}</span>
            </p>
          </div>

          <div className="mt-6">
            <div className="flex items-center">
              <p className="text-4xl/12 text-[#27303F] font-semibold self-start mb-2">$</p>
              <h1 className="text-5xl text-[#27303F] font-bold">N/A</h1>
              <span className="text-base/5.5 text-[#555D6A] font-medium self-end ml-0.5">N/A</span>
            </div>
          </div>
        </div>
        <BoxCardSeparator />
        <div className="pb-4 px-4 flex items-center justify-end">
          <Link
            href="/dashboard/dealer-management/change-plan"
            className="text-sm/4.5 text-[#099D01] font-bold flex items-center gap-1.5 hover:text-[#099D01]/80"
          >
            Change Plan
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </BoxCard>
    </BoxCard>
  );
};

SubscriptionAndBilling.displayName = 'SubscriptionAndBilling';
