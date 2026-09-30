import { BoxCard, BoxCardSeparator, BoxCardTitle } from '../../_components/BoxCard';

/**
 * Props for the AddressInfo component.
 *
 * @property {string} title - Short label for the address block (e.g. "primary", "billing").
 * @property {string[]} [addresses] - Optional list of additional addresses (billing/shipping/etc.).
 *   Each entry is rendered as a separate line and numbered starting at 1.
 * @property {string} [address] - Optional primary address string. Rendered above the list.
 */
interface AddressInfoProps {
  title: string;
  addresses?: string[];
  address?: string;
}

/**
 * AddressInfo
 *
 * A small presentational component that renders a titled card containing a primary address
 * and an optional list of additional addresses. The component is intentionally simple and
 * only concerns itself with rendering. Styling is applied via utility classes and the
 * surrounding `BoxCard` layout component.
 *
 * Example:
 * ```tsx
 * <AddressInfo
 *   title="billing"
 *   address="123 Main St, Springfield, IL"
 *   addresses={["456 Maple Ave, Apt 2", "789 Oak Blvd"]}
 * />
 *```
 *
 * Notes:
 * - `title` is used both as the card title and to build section headings for additional
 *   addresses (the first letter is capitalized).
 * - If `addresses` is empty or not provided, the additional-address section is omitted.
 */
export const AddressInfo = ({ title, addresses = [], address }: AddressInfoProps) => {
  return (
    <BoxCard>
      <BoxCardTitle>{title}</BoxCardTitle>
      <BoxCardSeparator />
      {/* Primary Address */}
      <div>
        <p className="text-base/5.5 text-[#2B3545]">{address}</p>
      </div>

      {/* Billing & Shipping Address; address 1, 2, 3 */}
      <div className="space-y-4">
        {addresses?.length > 0 &&
          addresses?.map((address, index) => {
            const addressNo = index + 1;
            return (
              <div key={addressNo} className="flex items-center gap-15">
                <h4 className="text-base/5.5 text-[#2B3545] font-semibold">
                  {title.charAt(0).toLocaleUpperCase() + title.slice(1)} {addressNo}
                </h4>
                <p className="text-base/5.5 text-[#2B3545]">{address}</p>
              </div>
            );
          })}
      </div>
    </BoxCard>
  );
};

AddressInfo.displayName = 'AddressInfo';
