'use client';
import { Alert, Snackbar, SnackbarCloseReason } from '@mui/material';
import React from 'react';

export const Toaster = ({
  open,
  setOpen,
  isSuccess,
  isError,
  message,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  isSuccess: boolean;
  isError: boolean;
  message: string;
}) => {
  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const severity = isError ? 'error' : 'success';
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={handleClose}
    >
      <Alert severity={severity}>{message}</Alert>
    </Snackbar>
  );
};

Toaster.displayName = 'Toaster';
