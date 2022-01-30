import React from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { hide } from "src/app/store/slices/toast";
import { useAppDispatch, useAppSelector } from "src/app/hooks";

/**
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default function AppToast() {
    const toast = useAppSelector((state) => state.toast)
    const dispatch = useAppDispatch()

    const handleClose = () => {
        dispatch(hide())
    }

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={toast.visible}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={toast.color}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </>

    )
}