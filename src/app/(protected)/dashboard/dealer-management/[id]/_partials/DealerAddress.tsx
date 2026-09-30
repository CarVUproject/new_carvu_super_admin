import { BoxCard, BoxCardSeparator, BoxCardTitle } from '../../_components/BoxCard';

export const DealerAddress = () => {
  return (
    <div className="space-y-4">
      <BoxCard>
        <BoxCardTitle>Primary Address</BoxCardTitle>
        <BoxCardSeparator />
        <div>
          <p className="text-base/5.5 text-[#2B3545]">
            1600 Amphitheatre Parkway, Mountain View, California, 94043, United States
          </p>
        </div>
      </BoxCard>

      <BoxCard>
        <BoxCardTitle>Shipping Address</BoxCardTitle>
        <BoxCardSeparator />
        <div className="space-y-4">
          {/* Shipping Address 1 */}
          <div className="flex items-center gap-15">
            <h4 className="text-base/5.5 text-[#2B3545] font-semibold">Shipping Address 1</h4>
            <p className="text-base/5.5 text-[#2B3545]">
              1600 Amphitheatre Parkway, Mountain View, California, 94043, United States
            </p>
          </div>

          {/* Shipping Address 2 */}
          <div className="flex items-center gap-15">
            <h4 className="text-base/5.5 text-[#2B3545] font-semibold">Shipping Address 2</h4>
            <p className="text-base/5.5 text-[#2B3545]">
              1600 Amphitheatre Parkway, Mountain View, California, 94043, United States
            </p>
          </div>
        </div>
      </BoxCard>
    </div>
  );
};

DealerAddress.displayName = 'DealerAddress';
