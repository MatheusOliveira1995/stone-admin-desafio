import React from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

/**
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface ToastSettings {
    visible: boolean,
    color: 'error' | 'info' | 'success' | 'warning' | undefined,
    message: string,
    handleClose: () => void
}

export default function AppToast({ message, color, visible, handleClose }: ToastSettings) {
    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={visible}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={color}>
                    {message}
                </Alert>
            </Snackbar>
        </>

    )
}