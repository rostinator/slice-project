import React, {useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useTranslation} from "react-i18next";

interface DeleteConfirmationDialogProps {
    handleClose(isConfirmed: boolean, value: any): void;
}

export type DeleteConfirmationDialogHandle = {
    handleOpenMenu: (value: any) => void;
};

const DeleteConfirmationDialog: React.ForwardRefRenderFunction<DeleteConfirmationDialogHandle, DeleteConfirmationDialogProps> = (props, forwardedRef) => {
    const {
        handleClose,
    } = props

    React.useImperativeHandle(forwardedRef, () => ({
        handleOpenMenu(value: any) {
            setValue(value)
            setOpen(true)
        },
    }))

    const {t} = useTranslation()
    const [value, setValue] = useState()
    const [open, setOpen] = useState<boolean>(false)

    const handleCloseInner = (isConfirmed: boolean) => {
        handleClose(isConfirmed, value)
        setOpen(false)
    }

    return (
        <Dialog
            open={open}
            onClose={() => handleCloseInner(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {t("common.confirmDeleteTitle")}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {t("common.confirmDeleteText")}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => handleCloseInner(false)}>{t("common.cancel")}</Button>
                <Button color="error"  onClick={() => handleCloseInner(true)} autoFocus>{t("common.delete")}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default React.forwardRef(DeleteConfirmationDialog)