import React, {useContext, useEffect, useState} from "react";
import {Alert, Box, Button, Chip, Divider, MenuItem, Stack, Tab, Tabs, Typography} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {useNavigate, useParams} from "react-router";
import {Project, Task, UpdateProject} from "../model/models";
import {ProjectAPI} from "../api/ProjectAPI";
import IconButtonSmall from "../componens/common/IconButtonSmall";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import TabPanel from "../componens/common/TabPanel";
import {useSearchParams} from "react-router-dom";
import CreateTaskDialog from "../componens/dialog/CreateTaskDialog";
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart';
import TaskDataGridPanel from "../componens/task/TaskDataGridPanel";
import {withLoading, WithLoadingProps} from "../componens/common/feedback/Loading";
import {AuthContext, AuthContextType} from "../context/AuthContext";
import GanttChartPanel from "../componens/gantt/GanttChartPanel";
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import GroupsIcon from '@mui/icons-material/Groups';
import {useTranslation} from "react-i18next";
import {projectTypeIconsMap} from "../componens/common/inputs/EnumIcons";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import OpenMenu from "../componens/common/OpenMenu";
import {grey, red} from "@mui/material/colors";
import {UserAPI} from "../api/UserAPI";
import {ProjectRole, ProjectType} from "../model/enums";
import {withSnackbar, WithSnackbarProps} from "../componens/common/feedback/Snackbar";
import DeleteIcon from '@mui/icons-material/Delete';
import {canUserEditProject} from "../utils/commonUtils";
import EditableTypography from "../componens/common/inputs/EditableTypography";
import EditableDescriptionTypography from "../componens/common/inputs/EditableDescriptionTypography";
import CpmPanel from "../componens/project/cpm/CpmPanel";
import PertPanel from "../componens/project/pert/PertPanel";
import {withBackdropLoading, WithBackdropLoadingProps} from "../componens/common/feedback/BackdropLoading";
import MpmPanel from "../componens/project/mpm/MpmPanel";
import InsightsIcon from '@mui/icons-material/Insights';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import DeleteConfirmationDialog from "../componens/dialog/DeleteConfirmationDialog";

interface ProjectDetailProps extends WithLoadingProps, WithSnackbarProps, WithBackdropLoadingProps {

}

const ProjectDetail: React.FC<ProjectDetailProps> = (props) => {
    const {
        startLoading,
        stopLoading,
        showAlert,
        openBackdropLoading,
        closeBackdropLoading,
    } = props

    const {id} = useParams()
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [searchParams, setSearchParams] = useSearchParams()
    const {currentUser} = useContext(AuthContext) as AuthContextType

    const [project, setProject] = useState<Project>()
    const [actualTab, setActualTab] = useState<number>(Number(searchParams.get('tab')) | 0)
    const [openTaskDialog, setOpenTaskDialog] = useState<boolean>(false)
    const [userProjectRole, setUserProjectRole] = useState<ProjectRole>()

    type OpenMenuHandler = React.ElementRef<typeof OpenMenu>;
    const openMenuRef = React.useRef<OpenMenuHandler>(null);

    type DeleteConfirmationDialogHandle = React.ElementRef<typeof DeleteConfirmationDialog>
    const deleteDialogRef = React.useRef<DeleteConfirmationDialogHandle>(null)

    useEffect(() => {
        startLoading()
        if (id) {
            const idAsNum = parseInt(id)
            if (idAsNum && idAsNum > 0) {
                const getData = async () => {
                    const data = await Promise.all([
                        ProjectAPI.get(idAsNum), UserAPI.getUserRoleInProject(currentUser.id, idAsNum)
                    ])

                    if (data[0].isSuccessful) {
                        setProject(data[0].data)
                    }

                    if (data[1].isSuccessful) {
                        setUserProjectRole(data[1].data)
                    }

                    stopLoading()
                }
                getData()
            }
        }
    }, [id])

    const updateProject = (updateProject1: UpdateProject) => {
        ProjectAPI.update(updateProject1)
            .then(response => {
                if (!response.isSuccessful) {
                    showAlert(t("common.somethingWentWrong"), 'error')
                }
            })
    }

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>): void => {
        openMenuRef?.current?.handleOpenMenu(event)
    }

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number): void => {
        setActualTab(newValue);
        searchParams.set("tab", newValue.toString())
        setSearchParams(searchParams)
    }

    const handleCloseTaskDialog = (task?: Task) => {
        if (task) {
            setProject(prevState => {
                if (prevState?.tasks) {
                    prevState.tasks = [...prevState?.tasks, task]
                } else {
                    if (prevState) prevState.tasks = [task]
                }
                return prevState
            })
        }
        setOpenTaskDialog(false)
    }

    const openCreateTaskDialog = () => {
        setOpenTaskDialog(true)
    }

    const handeLeaveProjectMenuItem = () => {
        if (!project)
            return

        ProjectAPI.deleteProjectMember(project.id, currentUser.id)
            .then(response => {
                if (response.isSuccessful) {
                    navigate("/ui/projects")
                    window.location.reload()
                } else {
                    showAlert(t("common.somethingWentWrong"), "error")
                }
            })
    }

    const handeDeleteProjectMenuItem = () => {
        if (!project)
            return

        openMenuRef?.current?.handleCloseMenu()

        deleteDialogRef?.current?.handleOpenMenu(project.id)
    }

    const handleChangeValue = (newValue: any, valueName: string): void => {
        if (project) {
            // @ts-ignore
            if (project[valueName] !== newValue) {
                setProject(prevState => {
                    // @ts-ignore
                    prevState[valueName] = newValue
                    return prevState
                })
                updateProject({
                    id: project.id,
                    name: project.name,
                    type: project.type,
                    description: project.description,
                    status: project.status
                })
            }
        }
    }

    const handleCloseDeleteConfirmationDialog = (isConfirmed: boolean, projectId: number) => {
        if (isConfirmed) {
            openBackdropLoading()
            ProjectAPI.delete(projectId)
                .then(response => {
                    if (response.isSuccessful) {
                        navigate("/ui/projects")
                        window.location.reload()
                    } else {
                        showAlert(t("common.somethingWentWrong"), "error")
                    }
                    closeBackdropLoading()
                })
        }
    }

    const EmptyProjectInfo = () => {
        return (
            <Box display='flex' justifyContent='center'>
                <Alert severity="info">{t("project.emptyProjectInfo")}</Alert>
            </Box>
        )
    }

    return (
        project ?
            <Stack m={2}>
                <Breadcrumbs>
                    <Chip
                        clickable
                        size='small'
                        color='secondary'
                        variant='outlined'
                        label={t("project.projects")}
                        onClick={() => {
                            navigate("/ui/projects")
                        }}
                    />
                    <Chip
                        clickable
                        size='small'
                        color='secondary'
                        variant='filled'
                        label={project?.name}
                        onClick={() => {
                            navigate("/ui/projects/" + project?.id)
                        }}
                    />
                </Breadcrumbs>
                <Divider sx={{my: 1.5}}/>
                <Box
                    p={1}
                    display='flex'
                >
                    <Box
                        flexGrow={1}
                        display='flex'
                        alignItems='center'
                    >
                        {projectTypeIconsMap.get(project.type)}
                        {canUserEditProject(userProjectRole) ?
                            <EditableTypography
                                initValue={project.name}
                                onChange={value => handleChangeValue(value, 'name')}
                                variant='h5'
                            />
                            :
                            <Typography
                                variant="h5"
                                ml={2}
                                mr={1}
                            >
                                {project?.name}
                            </Typography>
                        }
                        <IconButtonSmall icon={<MoreHorizIcon fontSize='small'/>} onClick={handleOpenMenu}/>
                        <OpenMenu ref={openMenuRef} toRight dense>
                            {(project.type === ProjectType.PUBLIC && userProjectRole !== ProjectRole.OWNER) &&
                                <MenuItem onClick={handeLeaveProjectMenuItem}>
                                    <ListItemIcon>
                                        <ReplyAllIcon fontSize='small' sx={{color: red[800]}}/>
                                    </ListItemIcon>
                                    <ListItemText>{t("project.leave")}</ListItemText>
                                </MenuItem>
                            }
                            {(userProjectRole === ProjectRole.OWNER) &&
                                <MenuItem onClick={handeDeleteProjectMenuItem}>
                                    <ListItemIcon>
                                        <DeleteIcon fontSize='small' sx={{color: grey[900]}}/>
                                    </ListItemIcon>
                                    <ListItemText>{t("common.delete")}</ListItemText>
                                </MenuItem>
                            }

                        </OpenMenu>

                    </Box>

                    <Box>
                        <Button size='small' startIcon={<GroupsIcon/>} onClick={() => navigate('members')}>
                            {t("project.members")}
                        </Button>
                    </Box>
                </Box>
                <Box p={1}>
                    <EditableDescriptionTypography
                        handleChangeValue={value => handleChangeValue(value, 'description')}
                        initValue={project.description}
                        enableEdit={canUserEditProject(userProjectRole)}
                    />
                </Box>

                <Box sx={{width: '100%'}}>
                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                        <Tabs value={actualTab} onChange={handleChangeTab} aria-label="basic tabs example">
                            <Tab
                                label={t("project.activities")}
                                icon={<FormatListBulletedIcon fontSize='small'/>}
                                iconPosition='start'
                                sx={{minHeight: 0}}
                            />
                            <Tab
                                label={t("ganttChart.title")}
                                icon={<WaterfallChartIcon fontSize='small'/>}
                                iconPosition='start'
                                sx={{minHeight: 0}}
                            />
                            <Tab
                                label={t("project.cpm")}
                                icon={<AccountTreeIcon fontSize='small'/>}
                                iconPosition='start'
                                sx={{minHeight: 0}}
                            />
                            <Tab
                                label={t("project.pert")}
                                icon={<InsightsIcon fontSize='small'/>}
                                iconPosition='start'
                                sx={{minHeight: 0}}
                            />
                            <Tab
                                label={t("project.mpm")}
                                icon={<LegendToggleIcon fontSize='small'/>}
                                iconPosition='start'
                                sx={{minHeight: 0}}
                            />
                        </Tabs>
                    </Box>
                    <TabPanel value={actualTab} index={0}>
                        <TaskDataGridPanel
                            tasks={project?.tasks ? project?.tasks : []}
                            openCreateTaskDialog={openCreateTaskDialog}
                            availableProjectMembers={project?.members ? project?.members : []}
                        />
                    </TabPanel>
                    <TabPanel value={actualTab} index={1}>
                        {project.tasks.length > 0 ?
                            <GanttChartPanel modelTasks={project?.tasks ? project?.tasks : []} editable={canUserEditProject(userProjectRole)}/>
                            :
                            <EmptyProjectInfo/>
                        }
                    </TabPanel>
                    <TabPanel value={actualTab} index={2}>
                        {project.tasks.length > 0 ?
                            <CpmPanel tasks={project?.tasks ? project?.tasks : []} projectId={project.id}/>
                            :
                            <EmptyProjectInfo/>
                        }
                    </TabPanel>
                    <TabPanel value={actualTab} index={3}>
                        {project.tasks.length > 0 ?
                             <PertPanel tasks={project?.tasks ? project?.tasks : []} projectId={project.id} editable={canUserEditProject(userProjectRole)}/>
                            :
                            <EmptyProjectInfo/>
                        }
                    </TabPanel>
                    <TabPanel value={actualTab} index={4}>
                        {project.tasks.length > 0 ?
                            <MpmPanel tasks={project?.tasks ? project?.tasks : []} projectId={project.id} editable={canUserEditProject(userProjectRole)}/>
                            :
                            <EmptyProjectInfo/>
                        }
                    </TabPanel>
                </Box>
                <CreateTaskDialog
                    projectId={project?.id}
                    open={openTaskDialog}
                    handleClose={handleCloseTaskDialog}
                    availablePreviousTasks={project?.tasks ? project?.tasks : []}
                    availableProjectMembers={project?.members ? project?.members : []}
                />
                <DeleteConfirmationDialog ref={deleteDialogRef} handleClose={handleCloseDeleteConfirmationDialog}/>
            </Stack>
            :
            <></>
    )
}

export default withSnackbar(withBackdropLoading(withLoading(ProjectDetail)))