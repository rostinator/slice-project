import React, {useContext, useEffect, useState} from "react";
import {
    Box,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemButton, ListItemIcon, ListItemText,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import {Project, Task} from "../model/models";
import {AuthContext, AuthContextType} from "../context/AuthContext";
import {UserAPI} from "../api/UserAPI";
import {withSnackbar, WithSnackbarProps} from "../componens/common/feedback/Snackbar";
import {withLoading, WithLoadingProps} from "../componens/common/feedback/Loading";
import {useTranslation} from "react-i18next";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {useNavigate} from "react-router";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import {projectTypeIconsSmallMap, statusIconsMap} from "../componens/common/inputs/EnumIcons";
import FactCheckIcon from '@mui/icons-material/FactCheck';
import SourceIcon from '@mui/icons-material/Source';
import {HtmlTooltip} from "../componens/common/InfoIcon";
import {grey} from "@mui/material/colors";

interface OverviewProps extends WithSnackbarProps, WithLoadingProps {

}

const Overview: React.FC<OverviewProps> = (props) => {
    const {
        startLoading,
        stopLoading,
        showAlert,
    } = props

    const {t} = useTranslation()
    const navigate = useNavigate()

    const [assignedTasks, setAssignedTasks] = useState<Task[]>()
    const [projects, setProjects] = useState<Project[]>()

    const {currentUser} = useContext(AuthContext) as AuthContextType

    useEffect(() => {
        if (currentUser) {
            const getData = async () => {
                const data = await Promise.all([
                    UserAPI.getAssignedTasks(currentUser.id), UserAPI.getAllProjects(currentUser.id)
                ])

                if (data[0].isSuccessful) {
                    setAssignedTasks(data[0].data)
                }

                if (data[1].isSuccessful) {
                    setProjects(data[1].data)
                }

                stopLoading()

                if (!data[0].isSuccessful || !data[1].isSuccessful)
                    showAlert(t("common.somethingWentWrong"), 'error')
            }
            getData()
        }
    }, [currentUser])

    return (
        assignedTasks && projects ?
            <Stack m={2}>
                <Breadcrumbs>
                    <Chip
                        clickable
                        size='small'
                        color='secondary'
                        variant='filled'
                        label={t("common.overview")}
                        onClick={() => {
                            navigate("/ui/overview")
                        }}
                    />
                </Breadcrumbs>
                <Divider sx={{my: 2}}/>

                <Box flexGrow={1} display='flex' alignItems='center'>
                    <DashboardIcon fontSize='large' sx={{mr: 2}}/>
                    <Typography variant='h5'>{t("common.overview")}</Typography>
                </Box>
                <Grid container columnSpacing={2} rowSpacing={2} mt={2}>
                    <Grid item xs={12} xl={6}>
                        <Paper
                            variant='outlined'
                            sx={{
                                p: 2,
                                ':hover': {
                                    boxShadow: 10,
                                },
                            }}
                        >
                            <Typography variant='h6'>{t("user.assignedTasks")}</Typography>
                            {assignedTasks.length > 0
                                ?
                                <List sx={{width: '100%'}} dense>
                                    {assignedTasks.map((task) => (
                                        <ListItem
                                            secondaryAction={
                                                task.status && statusIconsMap.get(task.status) &&
                                                <HtmlTooltip title={t(`status.${task.status}`)}>
                                                    <div>
                                                        {statusIconsMap.get(task.status)}
                                                    </div>
                                                </HtmlTooltip>
                                            }
                                            key={task.id}
                                            disablePadding
                                        >
                                            <ListItemButton
                                                onClick={event => navigate(`/ui/projects/${task.projectId}/tasks/${task.id}`)}
                                            >
                                                <ListItemIcon>
                                                    <AssignmentTurnedInIcon/>
                                                </ListItemIcon>
                                                <ListItemText
                                                    // sx={{display: 'flex', alignItems: 'center'}}
                                                    primary={task.name}
                                                    secondary={`${t("common.progress")} ${task.progress}%`}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                                :
                                <Box display='flex' alignItems='center' justifyContent='center' py={10}>
                                    <Stack alignItems='center' spacing={1}>
                                        <FactCheckIcon fontSize='large' style={{color: grey[500]}}/>
                                        <Typography variant='subtitle1' style={{color: grey[700]}}>
                                            {t("user.emptyAssignedTasks")}
                                        </Typography>
                                    </Stack>
                                </Box>
                            }
                        </Paper>
                    </Grid>
                    <Grid item xs={12} xl={6}>
                        <Paper variant='outlined'
                               sx={{
                                   p: 2,
                                   ':hover': {
                                       boxShadow: 10,
                                   },
                               }}
                        >
                            <Typography variant='h6'>{t("project.projects")}</Typography>
                            {projects.length > 0
                                ?
                                <List sx={{width: '100%'}} dense>
                                    {projects.map((project) => (
                                        <ListItem
                                            key={project.id}
                                            secondaryAction={
                                                <Typography
                                                    variant='caption'>{t(`projectStatus.${project.status}`)}</Typography>
                                            }
                                            disablePadding
                                        >
                                            <ListItemButton
                                                onClick={event => navigate(`/ui/projects/${project.id}`)}
                                            >
                                                <ListItemIcon>
                                                    {projectTypeIconsSmallMap.get(project.type)}
                                                </ListItemIcon>
                                                <ListItemText
                                                    // sx={{display: 'flex', alignItems: 'center'}}
                                                    primary={project.name}
                                                    // secondary={`${t("common.progress")} ${task.progress}%`}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                                :
                                <Box display='flex' alignItems='center' justifyContent='center' py={10}>
                                    <Stack alignItems='center' spacing={1}>
                                        <SourceIcon fontSize='large' style={{color: grey[500]}}/>
                                        <Typography variant='subtitle1' style={{color: grey[700]}}>
                                            {t("user.emptyProjects")}
                                        </Typography>
                                    </Stack>
                                </Box>
                            }
                        </Paper>
                    </Grid>
                </Grid>
            </Stack>
            :
            <></>
    )
}

export default withSnackbar(withLoading(Overview))