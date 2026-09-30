interface DealerModalInfoProps {
  name: string;
  position: string;
  email: string;
  businessPhone: string;
  dealerClass: string;
}

export const DealerModalInfo = ({
  name,
  position,
  email,
  businessPhone,
  dealerClass,
}: DealerModalInfoProps) => {
  return (
    <div>
      <ul className="space-y-2 w-[318px]">
        <li className=" flex justify-between">
          <p className="text-[#1F2631] text-base/5.5 font-semibold">Name</p>
          <p className="text-base/5.5 text-[#2B3545]">{name}</p>
        </li>
        <li className=" flex justify-between">
          <p className="text-[#1F2631] text-base/5.5 font-semibold">Position</p>
          <p className="text-base/5.5 text-[#2B3545]">{position}</p>
        </li>
        <li className=" flex justify-between">
          <p className="text-[#1F2631] text-base/5.5 font-semibold">Email</p>
          <p className="text-base/5.5 text-[#2B3545]">{email}</p>
        </li>
        <li className=" flex justify-between">
          <p className="text-[#1F2631] text-base/5.5 font-semibold">Business Phone</p>
          <p className="text-base/5.5 text-[#2B3545]">{businessPhone}</p>
        </li>
        <li className=" flex justify-between">
          <p className="text-[#1F2631] text-base/5.5 font-semibold">Dealer Class</p>
          <p className="text-base/5.5 text-[#099D01]">{dealerClass}</p>
        </li>
      </ul>
    </div>
  );
};

DealerModalInfo.displayName = 'DealerModalInfo';
