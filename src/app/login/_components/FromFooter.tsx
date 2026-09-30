import { cn } from '@/lib/twMerge';
import Link from 'next/link';

interface FormFooterProps {
  className?: string;
}

export const FormFooter = ({ className }: FormFooterProps) => {
  return (
    <div
      className={cn(
        'flex justify-center space-x-6 text-xs text-[#717882] font-lato mt-3',
        className,
      )}
    >
      <FormFooterItem href="#">Customer Support</FormFooterItem>
      <FormFooterItem href="#">Terms of Service</FormFooterItem>
    </div>
  );
};

FormFooter.displayName = 'FormFooter';

export const FormFooterItem = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link href={href} className="hover:text-gray-700">
      {children}
    </Link>
  );
};

FormFooterItem.displayName = 'FormFooterItem';
