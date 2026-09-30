import React from 'react';

import { cn } from '@/lib/utils';

type SubmitButtonProps = React.ComponentProps<'button'> & {
  text?: string;
  label?: string;
  variant?: 'base' | 'primary';
  icon?: React.ReactElement<{ className?: string }>;
  loading?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  iconPlacement?: 'before' | 'after';
  loadingIconClassNames?: string;
  loadingLabel?: string;
  width?: 'full' | 'auto';
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  className,
  icon,
  type = 'submit',
  text = 'Submit',
  label,
  loading = false,
  isLoading = false,
  disabled = false,
  iconPlacement = 'before',
  variant = 'primary',
  loadingIconClassNames,
  loadingLabel,
  width = 'full',
  ...rest
}) => {
  const resolvedText = label ?? text;
  const resolvedLoading = isLoading || loading;
  const renderedIcon = icon ?? null;
  const variantStyles = cn(
    variant === 'primary' &&
      'border-transparent bg-cv-secondary-600 text-white hover:bg-cv-secondary-600/70',
    variant === 'base' && 'border-[#d5d7da] bg-white text-cv-gray-500 hover:bg-zinc-200',
  );

  if (resolvedLoading) {
    return (
      <button type="button" disabled>
        <div
          className={cn(
            'relative flex cursor-progress items-center gap-2 overflow-hidden rounded-[12px] border px-4 py-3 font-semibold shadow',
            iconPlacement === 'after' && 'flex-row-reverse',
            width === 'full' ? 'w-full' : 'w-auto',
            variantStyles,
            className,
          )}
        >
          {renderedIcon
            ? React.cloneElement(renderedIcon, {
                className: cn(renderedIcon.props.className, 'invisible'),
              })
            : null}
          <span className="invisible">{resolvedText}</span>
          <div className="absolute left-0 top-0 grid h-full w-full place-content-center">
            <svg
              className={cn('size-5 animate-spin text-white', loadingIconClassNames)}
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
              />
            </svg>
            <span className="sr-only">{loadingLabel ?? `Loading ${resolvedText}`}</span>
          </div>
        </div>
      </button>
    );
  }

  if (disabled) {
    return (
      <div className="inline-block">
        <div
          className={cn(
            'flex cursor-not-allowed items-center justify-center gap-2 rounded-[12px] border px-4 py-3 font-semibold opacity-50 shadow',
            iconPlacement === 'after' && 'flex-row-reverse',
            width === 'full' ? 'w-full' : 'w-auto',
            variantStyles,
            className,
          )}
        >
          {renderedIcon ? React.cloneElement(renderedIcon) : null}
          <span>{resolvedText}</span>
        </div>
      </div>
    );
  }

  return (
    <button
      type={type}
      className={cn(
        'flex cursor-pointer items-center justify-center gap-2 rounded-[12px] border px-4 py-3 font-semibold shadow',
        iconPlacement === 'after' && 'flex-row-reverse',
        width === 'full' ? 'w-full' : 'w-auto',
        variantStyles,
        className,
      )}
      {...rest}
    >
      {renderedIcon ? React.cloneElement(renderedIcon) : null}
      <span>{resolvedText}</span>
    </button>
  );
};

SubmitButton.displayName = 'SubmitButton';

export { SubmitButton };
export default SubmitButton;
