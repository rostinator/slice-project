import React from "react";
import {useTranslation} from "react-i18next";
import {Box, Chip, Divider, Grid, Paper, Stack, Typography} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {useNavigate} from "react-router";
import {grey} from "@mui/material/colors";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import InsightsIcon from '@mui/icons-material/Insights';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import {Link} from "react-router-dom";

interface GridPaper {
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
}

const Home: React.FC = () => {
    const {t} = useTranslation()
    const navigate = useNavigate()

    const methodDescriptionContent = (description: string): React.ReactNode => {
        return (
            <Box mt={1}>
                <Typography
                    variant='body2'
                    sx={{color: grey[600], textAlign: "justify"}}
                >
                    {t(description)}
                </Typography>
            </Box>
        )
    }

    const gridPapers: GridPaper[] = [
        {
            title: "cpm.name",
            icon: <AccountTreeIcon fontSize="small" color='disabled'/>,
            content: methodDescriptionContent("cpm.description")
        },
        {
            title: "pert.name",
            icon: <InsightsIcon fontSize="small" color='disabled'/>,
            content: methodDescriptionContent("pert.description")
        },
        {
            title: "mpm.name",
            icon: <LegendToggleIcon fontSize="small" color='disabled'/>,
            content: methodDescriptionContent("mpm.description")
        },
        {
            title: "tutorial.title",
            icon: <HelpOutlineIcon fontSize="small" color='disabled'/>,
            content:
                <Box mt={1}>
                    <Typography
                        variant='body2'
                        sx={{color: grey[600], textAlign: "justify"}}
                    >
                        {t("tutorial.description")}
                    </Typography>
                    <Box display='flex' justifyContent='center' my={2}>
                        <Link to='/ui/tutorial' color="inherit">
                            <Typography variant='subtitle2' color='inherit'>
                                {t("tutorial.goToTutorial")}
                            </Typography>
                        </Link>
                    </Box>
                </Box>
        },
    ]

    return (
        <Stack m={2}>
            <Breadcrumbs>
                <Chip
                    clickable
                    size='small'
                    color='secondary'
                    variant='filled'
                    label={t("common.home")}
                    onClick={() => {
                        navigate("/ui")
                    }}
                />
            </Breadcrumbs>
            <Divider sx={{my: 2}}/>

            <Stack alignItems='center' spacing={2}>
                <Typography variant='h4'>
                    {t("common.appTitle")}
                </Typography>
                <Typography variant='body2' style={{color: grey[600]}} maxWidth='100em'>
                    {t("common.appDescription")}
                </Typography>
            </Stack>
            <Grid container columnSpacing={2} rowSpacing={2} mt={2}>
                {gridPapers.map((value) => (
                    <Grid item xs={12} md={6} xl={4}>
                        <Paper
                            variant='outlined'
                            sx={{
                                p: 3,
                                height: "100%",
                                ':hover': {
                                    boxShadow: 10,
                                },
                            }}
                        >
                            <Box
                                display='flex'
                                alignItems='center'
                            >
                                {value.icon}
                                <Typography variant='h6' ml={1}>{t(value.title)}</Typography>
                            </Box>
                            {value.content}
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    )
}

export default Home;