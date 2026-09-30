import { Alert, AlertProps, Collapse, IconButton } from '@mui/material';
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type PropsTypes = {
  text: string;
  open?: boolean;
  crossNeeded?: boolean;
} & AlertProps;

const CustomAlert: React.FC<PropsTypes> = ({
  text,
  open = false,
  crossNeeded = false,
  ...rest
}) => {
  /**-Next Hooks-**/
  //states
  const [alertOpen, setAlertOpen] = useState(false);

  /**-useEffects-**/
  useEffect(() => {
    setAlertOpen(open);
  }, [open]);

  return (
    <Collapse in={alertOpen}>
      <Alert
        {...(crossNeeded && {
          action: (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setAlertOpen(false);
              }}
            >
              <X fontSize="inherit" />
            </IconButton>
          ),
        })}
        {...rest}
      >
        {text}
      </Alert>
    </Collapse>
  );
};

export default CustomAlert;
