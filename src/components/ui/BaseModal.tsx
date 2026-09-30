'use client';
import { Backdrop, Box, Fade, Modal, Typography } from '@mui/material';
import { X } from 'lucide-react';
import { cn } from '@/lib/twMerge';
import React, { MouseEvent } from 'react';

interface BaseModalProps {
  open: boolean;
  onClose: (e: MouseEvent<HTMLDivElement>) => void;
  title?: string;
  width?: string | number;
  maxWidth?: string | number;
  children: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  open,
  onClose,
  title,
  width = '100%',
  maxWidth,
  children,
  showCloseButton = true,
  className,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      aria-labelledby="app-modal-title"
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
          sx: { backgroundColor: 'rgba(69, 66, 66, 0.224)' },
        },
      }}
    >
      <Fade in={open}>
        <Box
          className={cn('outline-0 bg-white rounded-2xl p-6 mx-auto', className)}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width,
            maxWidth: maxWidth ? maxWidth : '720px',
            boxShadow: '0px 2px 12px rgba(17, 9, 9, 0.08)',
          }}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <Box className="flex items-center justify-between border-b border-[#EFF4FA] pb-4 mb-4">
              {title && (
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h6"
                  className="text-[#555D6A]! text-3xl/10! font-bold!"
                >
                  {title}
                </Typography>
              )}
              {showCloseButton && (
                <Box
                  onClick={onClose}
                  className="w-9 h-9 bg-white border border-[#DBE2EB] rounded-lg p-1.5 cursor-pointer hover:shadow-sm flex items-center justify-center"
                >
                  <X type="button" color="#5D6679" size={22} />
                </Box>
              )}
            </Box>
          )}

          {/* Body */}
          <Box className="space-y-4 text-base/5.5 text-[#9DA2A9]">{children}</Box>
        </Box>
      </Fade>
    </Modal>
  );
};

BaseModal.displayName = 'BaseModal';
