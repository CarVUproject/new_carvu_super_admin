'use client';

import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

type ErrorLabelProps = {
  text: string;
} & ComponentProps<'p'>;

export default function ErrorLabel({ text, className, ...props }: ErrorLabelProps) {
  return (
    <p
      className={cn(
        'mt-1 text-sm font-normal text-[#FF2626] transition-all duration-300 ease-in-out',
        className,
      )}
      {...props}
    >
      {text}
    </p>
  );
}
