/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactElement } from "react";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import { TransitionProps } from '@mui/material/transitions';

import {
  DialogContent,
  DialogTitle,
  Slide 
} from '@mui/material'


type DialogType = {
  open: boolean,
  handleClose: () => void
  children: ReactElement,
  title: string,
  disableEscKeyDown?: boolean
}

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

/**
 */
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
/**
 * @param props DialogTitleProps
 */
const AppDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

/**
 */
export default function FormModal({ open, title, handleClose, disableEscKeyDown = true, children }: DialogType) {
  
  const closeHandler = (event: Object, reason: string) => {
    if(reason && reason === 'backdropClick') return;
    handleClose()
  }
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={closeHandler}
        fullWidth
        maxWidth="md"
        TransitionComponent={Transition}
        scroll='paper'
        disableEscapeKeyDown={disableEscKeyDown}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <AppDialogTitle id="scroll-dialog-title"  onClose={ handleClose }>{title}</AppDialogTitle>
        <DialogContent dividers={true}>
          {children}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}