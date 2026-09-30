import { cn } from '@/lib/twMerge';
import Link from 'next/link';
import * as React from 'react';

interface FormBottomLinksProps {
  children: React.ReactNode;
  className?: string;
}

const FormBottomLinks = ({ children, className }: FormBottomLinksProps) => {
  return <div className={cn('text-center space-y-2', className)}>{children}</div>;
};

const FormBottomPrimaryLink = ({
  href = '/auth/forgot-password',
  text = 'Forgot Password?',
}: {
  href?: string;
  text?: string;
}) => {
  return (
    <Link href={href}>
      <span className="text-[#2B3545] text-base font-lato hover:text-gray-800 cursor-pointer">
        {text}
      </span>
    </Link>
  );
};

const FormBottomSecondaryLink = ({
  href = '/signup',
  text = 'Sign-up',
  label = 'Want New Account? ',
}: {
  href?: string;
  text?: string;
  label?: string;
}) => {
  return (
    <div className="text-[#2B3545] font-lato">
      {label}
      <Link href={href}>
        <span className="text-primary hover:text-green-700 font-medium cursor-pointer">{text}</span>
      </Link>
    </div>
  );
};

export { FormBottomLinks, FormBottomPrimaryLink, FormBottomSecondaryLink };
