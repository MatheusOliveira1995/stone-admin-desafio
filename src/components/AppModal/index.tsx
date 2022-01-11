/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactElement } from "react";
import { Box } from '@mui/material';

import Modal from '@mui/material/Modal';


type ModalType = {
    open: boolean,
    handleClose: () => void
    children: ReactElement
  }

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};  
  
export default function FormModal ({open, handleClose, children }: ModalType) {
    return (
      <React.Fragment>
        <Modal open={open} onClose={handleClose}>
          <Box sx={{ ...style, width: 400 }}>
            { children }
          </Box> 
        </Modal>
       </React.Fragment> 
    )
  }