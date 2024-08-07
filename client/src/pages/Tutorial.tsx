import React from "react";
import {
    Box,
    Chip,
    Divider,
    Grid,
    Stack,
    Step,
    StepButton,
    Stepper,
    Typography
} from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {Trans, useTranslation} from "react-i18next";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {useNavigate} from "react-router";
import {Link, useSearchParams} from "react-router-dom";
import TabPanel from "../componens/common/TabPanel";
import {grey} from "@mui/material/colors";
import {styled} from "@mui/material/styles";

const TypographyText = styled(Typography)(({theme}) => ({
    '&': {
        color: grey[700],
    },
})) as typeof Typography

const TypographySubtitle = styled(Typography)(({theme}) => ({
    '&': {
        marginTop: 25,
    },
})) as typeof Typography

interface TutorialStep {
    title: string;
    caption: string;
    content: React.ReactNode;
}

const Tutorial: React.FC = () => {

    const {t} = useTranslation()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const [activeStep, setActiveStep] = React.useState<number>(Number(searchParams.get('step')) | 0)

    const handleStep = (step: number) => () => {
        setActiveStep(step)
        searchParams.set("step", step.toString())
        setSearchParams(searchParams)
    }

    const steps: TutorialStep[] = [
        {
            title: "tutorial.registrationAndLoginTitle",
            caption: "tutorial.registrationAndLoginCaption",
            content:
                <>
                    <Typography variant='h5'>{t("tutorial.registrationAndLoginTitle")}</Typography>
                    <Divider sx={{my: 2, borderBottomWidth: 3}}/>
                    <TypographyText>{t("tutorial.registrationAndLoginText1")}</TypographyText>
                    <TypographySubtitle variant='h6'>{t("tutorial.registrationAndLoginSubtitle1")}</TypographySubtitle>
                    <Divider sx={{mt: 0.5, mb: 2}}/>
                    <TypographyText>
                        <Trans i18nKey='tutorial.registrationAndLoginText2'
                               components={[<Link to='/ui/sign-up' color="inherit"/>]}/>
                    </TypographyText>

                    <TypographyText mt={2}>
                        <Trans i18nKey='tutorial.registrationAndLoginText3' components={[<strong/>]}/>
                    </TypographyText>
                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/register-form.png')} width={500} alt='register-form'/>
                    </Box>

                    <TypographySubtitle variant='h6'>{t("tutorial.registrationAndLoginSubtitle2")}</TypographySubtitle>
                    <Divider sx={{mt: 0.5, mb: 2}}/>
                    <TypographyText mt={2}>
                        <Trans i18nKey='tutorial.registrationAndLoginText4'
                               components={[<Link to='/ui/sign-in' color="inherit"/>, <strong/>]}/>
                    </TypographyText>
                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/login-form.png')} width={400} alt='login-form'/>
                    </Box>
                </>
        },
        {
            title: "tutorial.overviewTitle",
            caption: "tutorial.overviewCaption",
            content:
                <>
                    <Typography variant='h5'>{t("tutorial.overviewTitle")}</Typography>
                    <Divider sx={{my: 2, borderBottomWidth: 3}}/>
                    <TypographyText>
                        <Trans i18nKey='tutorial.overviewText1'
                               components={[<strong/>, <Link to='/ui/overview' color="inherit"/>]}/>
                    </TypographyText>
                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/overview-page.png')} width={1000} alt='overview-page'/>
                    </Box>
                    <TypographyText>
                        <Trans i18nKey='tutorial.overviewText2'
                               components={[<strong/>, <Link to='/ui/overview' color="inherit"/>]}/>
                    </TypographyText>
                </>
        },
        {
            title: "tutorial.projectsTitle",
            caption: "tutorial.projectsCaption",
            content:
                <>
                    <Typography variant='h5'>{t("tutorial.projectsTitle")}</Typography>
                    <Divider sx={{my: 2, borderBottomWidth: 3}}/>
                    <TypographyText>
                        {t("tutorial.projectsText1")}
                    </TypographyText>
                    <TypographySubtitle variant='h6'>{t("tutorial.projectsSubtitle1")}</TypographySubtitle>
                    <Divider sx={{mt: 0.5, mb: 2}}/>

                    <TypographyText>
                        <Trans i18nKey='tutorial.projectsText2'
                               components={[<strong/>]}/>
                    </TypographyText>

                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/project-page.png')} width={1000} alt='project-page'/>
                    </Box>

                    <TypographyText>
                        <Trans i18nKey='tutorial.projectsText3'
                               components={[<strong/>]}/>
                    </TypographyText>
                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/create-project-dialog.png')} width={400} alt='create-project-dialog'/>
                    </Box>

                    <TypographySubtitle variant='h6'>{t("tutorial.projectsSubtitle2")}</TypographySubtitle>
                    <Divider sx={{mt: 0.5, mb: 2}}/>

                    <TypographyText>
                        <Trans i18nKey='tutorial.projectsText4' components={[<strong/>]}/>
                    </TypographyText>

                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/projects-list-link.png')} width={400} alt='projects-list-link'/>
                    </Box>
                    <TypographyText>
                        <Trans i18nKey='tutorial.projectsText5' components={[<strong/>]}/>
                    </TypographyText>
                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/projects-page.png')} width={1000} alt='projects-page'/>
                    </Box>

                    <TypographySubtitle variant='h6'>{t("tutorial.projectsSubtitle3")}</TypographySubtitle>
                    <Divider sx={{mt: 0.5, mb: 2}}/>

                    <TypographyText>
                        <Trans i18nKey='tutorial.projectsText6' components={[<strong/>]}/>
                    </TypographyText>

                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/project-detail.png')} width={1000} alt='project-detail'/>
                    </Box>

                    <TypographySubtitle variant='h6'>{t("tutorial.projectsSubtitle4")}</TypographySubtitle>
                    <Divider sx={{mt: 0.5, mb: 2}}/>
                    <TypographyText>
                        <Trans i18nKey='tutorial.projectsText7' components={[<strong/>]}/>
                    </TypographyText>
                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/project-members.png')} width={1000} alt='project-members'/>
                    </Box>

                    <TypographyText>
                        <Trans i18nKey='tutorial.projectsText8' components={[<strong/>]}/>
                    </TypographyText>

                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/invite-project-member.png')} width={400} alt='invite-project-member'/>
                    </Box>
                </>
        },
        {
            title: "tutorial.tasksTitle",
            caption: "tutorial.tasksCaption",
            content:
                <>
                    <Typography variant='h5'>{t("tutorial.tasksTitle")}</Typography>
                    <Divider sx={{my: 2, borderBottomWidth: 3}}/>
                    <TypographyText>
                        {t("tutorial.tasksText1")}
                    </TypographyText>
                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/task-list.png')} width={1000} alt='task-list'/>
                    </Box>
                    <TypographySubtitle variant='h6'>{t("tutorial.tasksSubtitle1")}</TypographySubtitle>
                    <Divider sx={{mt: 0.5, mb: 2}}/>
                    <TypographyText>
                        <Trans i18nKey='tutorial.tasksText2' components={[<strong/>]}/>
                    </TypographyText>

                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/task-dialog.png')} width={400} alt='task-dialog'/>
                    </Box>

                    <TypographySubtitle variant='h6'>{t("tutorial.tasksSubtitle2")}</TypographySubtitle>
                    <Divider sx={{mt: 0.5, mb: 2}}/>
                    <TypographyText>
                        <Trans i18nKey='tutorial.tasksText3' components={[<strong/>]}/>
                    </TypographyText>

                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/task-detail.png')} width={1000} alt='task-detail'/>
                    </Box>
                </>
        },
        {
            title: "tutorial.ganttChartTitle",
            caption: "tutorial.ganttChartCaption",
            content:
                <>
                    <Typography variant='h5'>{t("tutorial.ganttChartTitle")}</Typography>
                    <Divider sx={{my: 2, borderBottomWidth: 3}}/>
                    <TypographyText>
                        {t("tutorial.ganttChartText1")}
                    </TypographyText>

                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/gantt-chart.png')} width={1000} alt='gantt-chart'/>
                    </Box>
                </>
        },
        {
            title: "tutorial.networkAnalysisTitle",
            caption: "tutorial.networkAnalysisCaption",
            content:
                <>
                    <Typography variant='h5'>{t("tutorial.networkAnalysisTitle")}</Typography>
                    <Divider sx={{my: 2, borderBottomWidth: 3}}/>
                    <TypographyText>
                        {t("tutorial.networkAnalysisText1")}
                    </TypographyText>
                    <TypographySubtitle variant='h6'>{t("tutorial.networkAnalysisSubtitle1")}</TypographySubtitle>
                    <Divider sx={{mt: 0.5, mb: 2}}/>

                    <TypographyText>
                        <Trans i18nKey='tutorial.networkAnalysisText2' components={[<strong/>]}/>
                    </TypographyText>

                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/cpm-calculation.png')} width={1000} alt='cpm-calculation'/>
                    </Box>

                    <TypographyText>
                        <Trans i18nKey='tutorial.networkAnalysisText3' components={[<strong/>]}/>
                    </TypographyText>

                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/cpm-calculation-table.png')} width={1000} alt='cpm-calculation-table'/>
                    </Box>

                    <TypographySubtitle variant='h6'>{t("tutorial.networkAnalysisSubtitle2")}</TypographySubtitle>
                    <Divider sx={{mt: 0.5, mb: 2}}/>

                    <TypographyText>
                        <Trans i18nKey='tutorial.networkAnalysisText4' components={[<strong/>]}/>
                    </TypographyText>

                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/pert-calculation-table.png')} width={1000} alt='pert-calculation-table'/>
                    </Box>

                    <TypographyText>
                        <Trans i18nKey='tutorial.networkAnalysisText5' components={[<strong/>]}/>
                    </TypographyText>

                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/pert-calculation.png')} width={1000} alt='pert-calculation'/>
                    </Box>

                    <TypographySubtitle variant='h6'>{t("tutorial.networkAnalysisSubtitle3")}</TypographySubtitle>
                    <Divider sx={{mt: 0.5, mb: 2}}/>

                    <TypographyText>
                        <Trans i18nKey='tutorial.networkAnalysisText6' components={[<strong/>]}/>
                    </TypographyText>

                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/mpm-calculation-table.png')} width={1000} alt='mpm-calculation-table'/>
                    </Box>

                    <TypographyText>
                        <Trans i18nKey='tutorial.networkAnalysisText7' components={[<strong/>]}/>
                    </TypographyText>

                    <Box display='flex' justifyContent='center' my={3}>
                        <img src={require('../assets/images/mpm-calculation.png')} width={1000} alt='mpm-calculation'/>
                    </Box>
                </>
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
                    label={t("tutorial.title")}
                    onClick={() => navigate("/ui/tutorial")}
                />
            </Breadcrumbs>
            <Divider sx={{my: 2}}/>
            <Box display='flex' alignItems='center'>
                <HelpOutlineIcon fontSize='large' sx={{mr: 2}}/>
                <Typography variant='h5'>
                    {t("tutorial.title")}
                </Typography>
            </Box>

            <Grid container mt={3} px={3} columnSpacing={2}>
                <Grid item xs={12} md={2}>
                    <Stepper orientation="vertical" nonLinear activeStep={activeStep}>
                        {steps.map((step, index) => (
                            <Step key={index}>
                                <StepButton
                                    color="inherit"
                                    onClick={handleStep(index)}
                                    optional={
                                        <Typography variant="caption">{t(step.caption)}</Typography>
                                    }
                                >
                                    <Typography variant='body1'>{t(step.title)}</Typography>
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                </Grid>
                <Grid item xs={12} md={10}>
                    {steps.map((step, index) => (
                        <TabPanel key={index} value={activeStep} index={index} disablePadding>
                            {step.content}
                        </TabPanel>
                    ))}
                </Grid>
            </Grid>
        </Stack>
    )
}

export default Tutorial