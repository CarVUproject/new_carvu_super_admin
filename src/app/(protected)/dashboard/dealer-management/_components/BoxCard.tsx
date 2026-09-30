'use client';

import { cn } from '@/lib/twMerge';
import { Box, Divider } from '@mui/material';
import * as React from 'react';

// Root Card
export const BoxCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Box
      ref={ref}
      className={cn('p-4 rounded-2xl border border-[#EAEBEC] bg-white ', className)}
      {...props}
    />
  ),
);
BoxCard.displayName = 'BoxCard';

export const BoxCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('font-bold text-lg/6 text-[#2B3545]', className)} {...props} />
));
BoxCardTitle.displayName = 'BoxCardTitle';

export const BoxCardSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Divider>
>(({ className, ...props }, ref) => (
  <Box ref={ref} className={cn('py-4', className)}>
    <Divider {...props} />
  </Box>
));
BoxCardSeparator.displayName = 'BoxCardSeparator';

// Content
export const BoxCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Box ref={ref} className={cn('p-4 pt-0 text-gray-700', className)} {...props} />
));
BoxCardContent.displayName = 'BoxCardContent';
