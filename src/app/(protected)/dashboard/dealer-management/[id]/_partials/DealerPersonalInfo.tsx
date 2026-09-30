import { HighlightBadge } from '@/components/ui/HighlightBadge';
import { InfoDetailsList } from '@/components/ui/InfoDetailsList';
import Image from 'next/image';
import { BoxCard, BoxCardSeparator, BoxCardTitle } from '../../_components/BoxCard';

interface DealerPersonalInfoProps {
  imgUrl: string;
  name: string;
  position: string;
  email: string;
  businessPhone: string;
  status: string;
}
export const DealerPersonalInfo = ({
  imgUrl,
  name,
  position,
  email,
  businessPhone,
  status,
}: DealerPersonalInfoProps) => {
  const data = {
    imgUrl,
    name,
    position,
    email,
    businessPhone,
  };

  const fields = [
    { label: 'Name', key: 'name' },
    { label: 'Position', key: 'position' },
    { label: 'Business Phone', key: 'businessPhone' },
    { label: 'Email', key: 'email' },
  ];
  return (
    <BoxCard>
      <BoxCardTitle>Dealer Information</BoxCardTitle>
      <BoxCardSeparator />
      <div className="flex gap-4">
        <div className="space-y-3">
          <div>
            <Image src={imgUrl} width={96} height={96} alt="dealer img" className="rounded-xl" />
          </div>

          <HighlightBadge
            label={status || 'Pending'}
            status={status as 'pending' | 'approved' | 'rejected' | 'active' | 'inactive'}
            className="w-full"
          />
        </div>

        <div>
          <InfoDetailsList fields={fields} data={data} />
        </div>
      </div>
    </BoxCard>
  );
};

DealerPersonalInfo.displayName = 'DealerPersonalInfo';
