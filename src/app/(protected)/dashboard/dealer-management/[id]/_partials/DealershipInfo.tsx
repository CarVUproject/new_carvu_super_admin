import { InfoDetailsList } from '@/components/ui/InfoDetailsList';
import Image from 'next/image';
import { BoxCard, BoxCardSeparator, BoxCardTitle } from '../../_components/BoxCard';

const fields = [
  { label: 'Operating name', key: 'operating_name' },
  { label: 'Dealer Class', key: 'dealer_class' },
  { label: 'Dealership Email', key: 'dealership_email' },
  { label: 'Phone Number', key: 'business_number' },
  { label: 'Business Type', key: 'business_type' },
  { label: 'Business Number', key: 'business_number' },
  { label: 'OMVIC Dealer Number', key: 'omvic_number' },
  { label: 'Tax ID / HST / EIN', key: 'tax_id' },
  { label: 'Website', key: 'business_website' },
];

type PropsTypes = {
  dealershipInfo: Record<string, any>;
};

export const DealershipInfo: React.FC<PropsTypes> = ({ dealershipInfo = {} }) => {
  return (
    <BoxCard>
      <BoxCardTitle>Dealership Information</BoxCardTitle>
      <BoxCardSeparator />
      <div className="flex gap-4">
        <div className="space-y-3">
          <div>
            <Image
              src="/assets/images/dealership-placeholder.png"
              width={96}
              height={96}
              alt="dealer img"
              className="rounded-xl border border-[#EAEBEC]"
            />
          </div>
        </div>

        <div>
          <InfoDetailsList data={dealershipInfo} fields={fields} />
        </div>
      </div>
    </BoxCard>
  );
};

DealershipInfo.displayName = 'DealershipInfo';
