import React, {useContext, useEffect, useState} from "react";
import {Box, Chip, Divider, Stack, Typography} from "@mui/material";
import {withLoading, WithLoadingProps} from "../componens/common/feedback/Loading";
import {withSnackbar, WithSnackbarProps} from "../componens/common/feedback/Snackbar";
import {AuthContext, AuthContextType} from "../context/AuthContext";
import {UserAPI} from "../api/UserAPI";
import {useTranslation} from "react-i18next";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationAccordion from "../componens/notification/NotificationAccordion";
import {Notification} from "../model/models";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {useNavigate} from "react-router";

interface NotificationsProps extends WithLoadingProps, WithSnackbarProps {

}

const Notifications: React.FC<NotificationsProps> = (props) => {
    const {
        startLoading,
        stopLoading,
        showAlert
    } = props

    const {currentUser} = useContext(AuthContext) as AuthContextType
    const {t} = useTranslation()
    const navigate = useNavigate()

    const [notifications, setNotifications] = useState<Notification[]>()

    useEffect(() => {
        UserAPI.getNotifications(currentUser.id)
            .then(response => {
                if (response.isSuccessful && response.data)
                    setNotifications(response.data)
                else
                    showAlert(t("common.somethingWentWrong"), 'error')

                stopLoading()
            })
    }, [])

    return (
        notifications ?
            <Stack m={2}>
                <Breadcrumbs>
                    <Chip
                        clickable
                        size='small'
                        color='secondary'
                        variant='filled'
                        label={t("notification.title")}
                        onClick={() => {
                            navigate("/ui/notifications")
                        }}
                    />
                </Breadcrumbs>
                <Divider sx={{my: 2}}/>
                <Box display='flex' alignItems='center' mb={3}>
                    <NotificationsActiveIcon fontSize='large' sx={{mr: 2}}/>
                    <Typography variant='h5'>
                        {t("notification.title")}
                    </Typography>
                </Box>

                {notifications.length > 0 ?
                    notifications.map((value, index) => (
                        <NotificationAccordion
                            key={value.id}
                            notification={value}
                        />
                    ))
                    :
                    <Typography variant='body1'>{t('notification.noNotificationsAvailable')}</Typography>
                }

            </Stack>
            : <></>
    )
}

export default withSnackbar(withLoading(Notifications))