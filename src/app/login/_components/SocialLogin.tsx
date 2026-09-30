'use client';
import { TwitterLogo } from '@/components/icons/TwitterLogo';
import { CustomButton } from '@/components/ui/Button';
import Image from 'next/image';
import { ReactNode } from 'react';

/**
 * SocialLogin component provides social authentication options (e.g., Google, Twitter).
 * Renders social login buttons and handles their click events.
 *
 * @component
 * @example
 * <SocialLogin />
 */
const SocialLogin = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <SocialButton onClick={() => console.log('Sign up with Google')}>
        <Image src="/assets/icons/google-logo.svg" alt="Google" width={24} height={24} />
        Sign up with Google
      </SocialButton>
      <SocialButton onClick={() => console.log('Sign up with Twitter')}>
        <TwitterLogo />
        Sign up with X
      </SocialButton>
    </div>
  );
};

export default SocialLogin;

/**
 * SocialButton component renders a styled button for social authentication providers.
 *
 * @param {Object} props - The component props
 * @param {ReactNode} props.children - The content to display inside the button
 * @param {() => void} [props.onClick] - Optional click handler for the button
 * @returns {JSX.Element}
 */
export const SocialButton = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) => {
  return (
    <>
      <CustomButton
        variant="social"
        className="flex items-center justify-center gap-3 py-4 !text-[#414651] !font-lato !text-base !font-semibold"
        onClick={onClick}
      >
        {children}
      </CustomButton>
    </>
  );
};

SocialButton.displayName = 'SocialButton';
