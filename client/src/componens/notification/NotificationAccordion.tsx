import React, {useState} from "react";
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary,
    Button,
    Stack,
    Typography
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {Notification} from "../../model/models";
import {useTranslation} from "react-i18next";
import {formatDateTime} from "../../utils/commonUtils";
import {NotificationType} from "../../model/enums";
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import {UserAPI} from "../../api/UserAPI";
import {withSnackbar, WithSnackbarProps} from "../common/feedback/Snackbar";
import {withBackdropLoading, WithBackdropLoadingProps} from "../common/feedback/BackdropLoading";

interface NotificationAccordionProps extends WithSnackbarProps, WithBackdropLoadingProps {
    notification: Notification
}

const NotificationAccordion: React.FC<NotificationAccordionProps> = (props) => {
    const {
        notification,
        showAlert,
        openBackdropLoading,
        closeBackdropLoading,
    } = props

    const {t} = useTranslation()
    const [unread, setUnread] = useState<boolean>(notification.unread)
    const [resolved, setResolved] = useState<boolean>(notification.resolved)

    const handleAccordionOnClick = (expanded: boolean) => {
        if (expanded && unread) {
            setUnread(false)
            UserAPI.markNotificationAsRead(notification.id)
                .then(response => {
                    if (!response.isSuccessful) {
                        showAlert(t("common.somethingWentWrong"), 'error')
                    }
                })
        }
    }

    const resolveNotification = (confirmed: boolean) => {
        openBackdropLoading()
        UserAPI.resolveNotification(notification.id, confirmed)
            .then(response => {
                if (response.isSuccessful) {
                    showAlert(t("notification.successfullyConfirmedProjectInvitation"), 'success')
                    setResolved(true)
                } else {
                    showAlert(t("common.somethingWentWrong"), 'error')
                }
                closeBackdropLoading()
            })
    }

    return (
        <Accordion
            variant='outlined'
            sx={{mb: 0.5}}
            onChange={(event, expanded) => handleAccordionOnClick(expanded)}
        >
            <AccordionSummary
                expandIcon={<KeyboardArrowDownIcon/>}
            >
                <Stack direction='column' width='100%' spacing={1}>
                    <Stack direction='row' width='100%' spacing={1}>
                        {unread ? <CircleIcon color='primary'/> : <CircleOutlinedIcon color='primary'/>}
                        <Typography
                            fontWeight='bold'
                            //    sx={{ width: '33%', flexShrink: 0 }}
                        >
                            {t(`notificationType.${notification.type}`)}
                        </Typography>
                        {/*<Typography sx={{color: 'text.secondary'}}>I am an accordion</Typography>*/}
                    </Stack>
                    <Typography variant='caption'>
                        {formatDateTime(notification.createdOn)}
                    </Typography>
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>{notification.content}</Typography>
            </AccordionDetails>
            {(notification.type === NotificationType.PROJECT_INVITATION && !resolved) &&
                <AccordionActions
                    sx={{
                        justifyContent: 'unset'
                    }}
                >
                    <Button size='small' onClick={() => resolveNotification(true)}>
                        {t("common.accept")}
                    </Button>
                    <Button size='small' color='error' onClick={() => resolveNotification(false)}>
                        {t("common.reject")}
                    </Button>
                </AccordionActions>
            }
        </Accordion>
    )
}

export default withBackdropLoading(withSnackbar(NotificationAccordion))