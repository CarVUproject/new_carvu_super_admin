import Image from 'next/image';

export const UserProfile = () => {
  return (
    <>
      <div className="flex items-center space-x-4">
        <Image
          src="/assets/images/placeholder-user.png"
          alt="User"
          width={44}
          height={44}
          className="h-11 w-11 rounded-[9.78px] object-cover"
        />
        <div className="text-sm font-lato">
          <p className="text-base text-[#2B3545] font-bold font-lato">Kawsar Amin</p>
          <p className="text-xs font-normal font-lato text-[#717882]">Car Dealer</p>
        </div>
      </div>
    </>
  );
};

UserProfile.displayName = 'UserProfile';
