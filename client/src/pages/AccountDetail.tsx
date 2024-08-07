import React, {useContext} from "react";
import {Box, Chip, Divider, Grid, Paper, Stack, TextField, Typography} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router";
import {AuthContext, AuthContextType} from "../context/AuthContext";

const AccountDetail: React.FC = () => {

    const {t} = useTranslation()
    const navigate = useNavigate()

    const {currentUser} = useContext(AuthContext) as AuthContextType

    return (
        <Stack m={2}>
            <Breadcrumbs>
                <Chip
                    clickable
                    size='small'
                    color='secondary'
                    variant='filled'
                    label={t("user.accountTitle")}
                    onClick={() => navigate("/ui/account")}
                />
            </Breadcrumbs>
            <Divider sx={{my: 2}}/>
            <Box display='flex' alignItems='center' mb={2}>
                <AccountBoxIcon fontSize='large' sx={{mr: 2}}/>
                <Typography variant='h5'>
                    {t("user.accountTitle")}
                </Typography>
            </Box>

            <Paper
                variant='outlined'
                sx={{
                    p: 2,
                    // ':hover': {
                    //     boxShadow: 1,
                    // },
                }}
            >
                <Typography
                    variant='h6'
                >
                    {t("user.profile")}
                </Typography>
                <Grid container my={2} rowSpacing={2}>
                    <Grid item xs={12}>
                        <Grid container direction="row" alignItems='center'>
                            <Grid item xs={12} sm={2} md={4}>
                                <Typography fontWeight='bold'>
                                    {t("user.email")}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={10} md={8}>
                                <TextField
                                    InputProps={{readOnly: true, disableUnderline: true}}
                                    fullWidth
                                    size="small"
                                    margin="none"
                                    value={currentUser.email}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container direction="row" alignItems='center'>
                            <Grid item xs={12} sm={2} md={4}>
                                <Typography fontWeight='bold'>
                                    {t("user.firstName")}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={10} md={8}>
                                <TextField
                                    InputProps={{readOnly: true, disableUnderline: true}}
                                    fullWidth
                                    name="firstName"
                                    size="small"
                                    margin="none"
                                    value={currentUser.firstName}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container direction="row" alignItems='center'>
                            <Grid item xs={12} sm={2} md={4}>
                                <Typography fontWeight='bold'>
                                    {t("user.lastName")}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={10} md={8}>
                                <TextField
                                    InputProps={{readOnly: true, disableUnderline: true}}
                                    fullWidth
                                    name="lastName"
                                    size="small"
                                    margin="none"
                                    value={currentUser.lastName}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container direction="row" alignItems='center'>
                            <Grid item xs={12} sm={2} md={4}>
                                <Typography fontWeight='bold'>
                                    {t("user.username")}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={10} md={8}>
                                <TextField
                                    InputProps={{readOnly: true, disableUnderline: true}}
                                    fullWidth
                                    name="username"
                                    size="small"
                                    margin="none"
                                    value={currentUser.username}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>


        </Stack>
    )
}

export default AccountDetail