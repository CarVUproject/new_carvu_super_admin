'use client';

import { cn } from '@/lib/twMerge';
import { Box, IconButton, Popover } from '@mui/material';
import { FC, MouseEvent, ReactNode, useState } from 'react';
import { MoreVertical } from '../icons/MoreVerticalIcon';

interface ActionPopoverProps {
  trigger?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const ActionPopover: FC<ActionPopoverProps> = ({ trigger, children, className }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleClick}>{trigger || <MoreVertical />}</IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          className: cn('rounded-xl! bg-white', className),
        }}
      >
        <Box className="flex flex-col rounded-xl">{children}</Box>
      </Popover>
    </>
  );
};

interface ActionItemProps {
  icon?: ReactNode;
  label: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  className?: string;
}

export const ActionItem: FC<ActionItemProps> = ({
  icon,
  label,
  onClick,
  disabled = false,
  className,
}) => {
  return (
    <Box
      onClick={!disabled ? onClick : undefined}
      className={cn(
        'flex items-center gap-2 px-3 py-2.5  text-sm cursor-pointer select-none transition-colors',
        disabled
          ? 'text-[#2B3545] cursor-not-allowed'
          : 'text-[#2B3545] hover:bg-[#EEF5EE] active:bg-[#EEF5EE]',
        'first:rounded-t-xl last:rounded-b-xl',
        className,
      )}
    >
      {icon && <span className="text-[#2B3545] size-4 text-base">{icon}</span>}
      <span className="text-xs/4 text-[#2B3545]">{label}</span>
    </Box>
  );
};

ActionItem.displayName = 'ActionItem';

export const ActionPopoverGroup = ({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) => {
  return <Box className={`flex flex-col ${className || ''}`}>{children}</Box>;
};

ActionPopoverGroup.displayName = 'ActionPopoverGroup';
