'use client';
import { cn } from '@/lib/twMerge';
import React from 'react';

interface InfoField {
  label: string;
  key: string;
}

interface InfoDetailsListProps {
  title?: string;
  data: Record<string, any>;
  fields: InfoField[];
}

/**
 * A reusable component for displaying structured information in a label-value format.
 *
 * This component renders a list of fields with their corresponding values from a data object.
 * Commonly used for displaying read-only details such as payment info, user info, or account details.
 *
 * @component
 * @example
 * ```tsx
 * const apiData = {
 *   accountHolderName: 'John Doe',
 *   bankName: 'City Bank',
 *   transitNumber: '46116516516',
 *   institutionNumber: '02125452',
 *   accountNumber: '12121546421',
 *   emailForDeposit: 'example@email.com',
 *   swiftCode: 'CTBKBDDH',
 * };
 *
 * const fields = [
 *   { label: 'Account Holder Name', key: 'accountHolderName' },
 *   { label: 'Bank Name', key: 'bankName' },
 *   { label: 'Transit Number', key: 'transitNumber' },
 *   { label: 'Institution Number', key: 'institutionNumber' },
 *   { label: 'Account Number', key: 'accountNumber' },
 *   { label: 'Email for Deposit', key: 'emailForDeposit' },
 *   { label: 'SWIFT Code', key: 'swiftCode' },
 * ];
 *
 * <InfoDisplay
 *   data={apiData}
 *   fields={fields}
 * />
 * ```
 *
 * @prop {Record<string, any>} data - The data object containing key-value pairs to display.
 * @prop {{ label: string; key: string }[]} fields - Array of fields defining which keys to show and their labels.
 *
 * @returns {JSX.Element} A list of labeled data fields displayed in a clean, readable layout.
 */

export const InfoDetailsList: React.FC<InfoDetailsListProps> = ({ data, fields }) => {
  console.log('DataHere: ', data);
  return (
    <div className="space-y-2">
      {fields.map((field) => (
        <div key={field.key} className="flex">
          <p
            className={cn(
              'w-60 text-[#1F2631] text-base/5.5 font-semibold',
              field.label === 'Dealer Class' && 'text-[#099D01]',
            )}
          >
            {field.label}
          </p>
          <p
            className={cn(
              'text-base/5.5 text-[#2B3545]',
              field.label === 'Dealer Class' && 'text-[#099D01]',
            )}
          >
            {data?.[field.key] ? data?.[field.key] : '--'}
          </p>
        </div>
      ))}
    </div>
  );
};

InfoDetailsList.displayName = 'InfoDetailsList';
