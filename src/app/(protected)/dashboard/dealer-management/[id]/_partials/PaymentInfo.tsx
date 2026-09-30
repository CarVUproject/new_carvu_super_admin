import { InfoDetailsList } from '@/components/ui/InfoDetailsList';
import { BoxCard, BoxCardSeparator } from '../../_components/BoxCard';
const apiData = {
  accountHolderName: 'John Doe',
  bankName: 'City Bank',
  transitNumber: '46116516516',
  institutionNumber: '02125452',
  accountNumber: '12121546421',
  emailForDeposit: 'example@email.com',
};

const fields = [
  { label: 'Account Holder Name', key: 'accountHolderName' },
  { label: 'Bank Name', key: 'bankName' },
  { label: 'Transit Number', key: 'transitNumber' },
  { label: 'Institution Number', key: 'institutionNumber' },
  { label: 'Account Number', key: 'accountNumber' },
  { label: 'Email for Deposit', key: 'emailForDeposit' },
];

export const PaymentInfo = () => {
  return (
    <BoxCard>
      <BoxCardSeparator />
      <InfoDetailsList fields={fields} data={apiData} />
    </BoxCard>
  );
};

PaymentInfo.displayName = 'PaymentInfo';
