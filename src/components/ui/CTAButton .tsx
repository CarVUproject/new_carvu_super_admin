import { cn } from '@/lib/twMerge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'contained' | 'alert';
  size?: 'sm' | 'md' | 'lg';
  width?: 'auto' | 'full';
  children: React.ReactNode;
}

export const CTAButton: React.FC<ButtonProps> = ({
  variant = 'contained',
  size = 'md',
  width = 'full',
  children,
  className,
  ...props
}) => {
  const baseStyle =
    'flex items-center justify-center gap-2 font-semibold rounded-lg cursor-pointer';

  const variantStyle = {
    outline: 'border-[#D5D7DA] bg-transparent shadow-gradient btn-base hover:bg-gray-100/80',
    contained: 'btn-gradient text-white py-2.75!',
    alert: 'btn-gradient text-white py-3 bg-[#FF2626]',
  };

  const sizeStyle = {
    sm: 'px-3 py-2 text-sm/4.5',
    md: 'px-4 py-3 text-base/5.5',
    lg: '',
  };

  const widthStyle = {
    auto: 'w-auto',
    full: 'w-full',
  };

  return (
    <button
      className={cn(
        baseStyle,
        variantStyle[variant],
        sizeStyle[size],
        widthStyle[width],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

CTAButton.displayName = 'CTAButton ';
