'use client';

export const LoginDivider = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border border-t border-[#000000]/10" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-8 bg-white text-base text-[#717882]/40 font-lato">
          Or, sign in with your email
        </span>
      </div>
    </div>
  );
};

export default LoginDivider;
