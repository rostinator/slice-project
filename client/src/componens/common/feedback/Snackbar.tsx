import React, {useEffect, useState} from "react";
import {Alert, Snackbar} from "@mui/material";
import {SnackbarCloseReason} from "@mui/material/Snackbar/Snackbar";
import {useLocation} from "react-router-dom";

type SeverityType = "error" | "info" | "success" | "warning";

export interface WithSnackbarProps {
    showAlert(message: string, severity?: SeverityType, duration?: number): void
}

export const withSnackbar = <T extends WithSnackbarProps>(WrappedComponent: React.FC<T>) => {
    return (props: any) => {
        const [open, setOpen] = useState<boolean>(false)
        const [message, setMessage] = useState<string>('')
        const [severity, setSeverity] = useState<SeverityType>("info")
        const [duration, setDuration] = useState<number>()
        const location = useLocation()

        const showAlert = (message: string, severity: SeverityType = "info", duration: number = 5000) => {
            setMessage(message)
            setSeverity(severity)
            setDuration(duration)
            setOpen(true)
        }

        const handleClose = (reason?: SnackbarCloseReason): void => {
            if (reason !== "clickaway")
                setOpen(false)
        }

        useEffect(() => {
            const locationState = location.state as { snackbarMessage?: string }
            if (locationState?.snackbarMessage) {
                showAlert(locationState?.snackbarMessage)
            }
            window.history.replaceState({}, '')
        }, [])

        return (
            <>
                <WrappedComponent {...props} showAlert={showAlert}/>
                <Snackbar
                    sx={{mt: 6}}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    open={open}
                    autoHideDuration={duration}
                    onClose={(event, reason) =>  handleClose(reason)}
                >
                    <Alert
                        sx={{width: '100%'}}
                        severity={severity}
                        onClose={() =>  handleClose()}
                    >
                        {message}
                    </Alert>
                </Snackbar>
            </>
        )
    }
}