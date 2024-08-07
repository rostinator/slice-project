import React, {PropsWithChildren} from "react";
import {
    Alert, Button,
    Dialog, DialogActions,
    DialogTitle, Divider,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {useTranslation} from "react-i18next";

export const DEF_DIALOG_CONTENT_PX: number = 6

interface FormDialogProps extends PropsWithChildren {
    open: boolean;
    onSubmit: any;

    handleCloseButton(): void;

    errorMessage?: string;
    title: string;
    customDialogActions?: boolean;
}

const FormDialog: React.FC<FormDialogProps> = (props) => {
    const {
        open,
        onSubmit,
        handleCloseButton,
        errorMessage,
        title,
        customDialogActions,
        children
    } = props

    const {t} = useTranslation()

    return (
        <Dialog
            open={open}
            PaperProps={{
                component: 'form',
                onSubmit: onSubmit,
                sx: {width: '100%'}
            }}
            maxWidth={"xs"}
        >
            <DialogTitle sx={{px: 3, pr: 5}}>
                {title}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleCloseButton}
                sx={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon/>
            </IconButton>
            <Divider/>
            {children}

            {!customDialogActions &&
                <DialogActions sx={{px: DEF_DIALOG_CONTENT_PX, pb: 4}}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        endIcon={<ChevronRightIcon/>}
                    >
                        {t("common.create")}
                    </Button>
                </DialogActions>
            }
            {errorMessage &&
                <Alert
                    severity='error'
                    sx={{
                        mx: 2,
                        mb: 2
                    }}
                >
                    {errorMessage}
                </Alert>
            }
        </Dialog>
    )
}

export default FormDialog