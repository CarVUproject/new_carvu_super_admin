import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { CTAButton } from './CTAButton ';

interface LoadingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'contained' | 'alert';
  label?: string;
  loadingLabel: string;
  isLoading: boolean;
  icon: ReactNode;
}

export const LoadingActionButton: FC<LoadingActionButtonProps> = ({
  isLoading = false,
  loadingLabel,
  label,
  variant = 'contained',
  icon,
  ...props
}) => {
  return (
    <CTAButton variant={variant} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" /> {loadingLabel}
        </>
      ) : (
        <>
          {icon && icon} <span>{label}</span>
        </>
      )}
    </CTAButton>
  );
};

LoadingActionButton.displayName = 'LoadingActionButton';
