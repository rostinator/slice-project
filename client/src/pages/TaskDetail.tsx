import React, {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {withLoading, WithLoadingProps} from "../componens/common/feedback/Loading";
import {TaskAPI} from "../api/TaskAPI";
import {ProjectMember, Task} from "../model/models";
import {Box, Button, Chip, Divider, Grid, Slider, Stack, Typography} from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {grey} from "@mui/material/colors";
import EditableTypography from "../componens/common/inputs/EditableTypography";
import TaskIcon from '@mui/icons-material/Task';
import PrioritySelect from "../componens/common/inputs/select/PrioritySelect";
import {withSnackbar, WithSnackbarProps} from "../componens/common/feedback/Snackbar";
import StatusSelect from "../componens/common/inputs/select/StatusSelect";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import UserSelect from "../componens/common/inputs/select/UserSelect";
import {ProjectAPI} from "../api/ProjectAPI";
import RelatedTasksAccordion from "../componens/task/RelatedTasksAccordion";
import {useTranslation} from "react-i18next";
import {ProjectMemberStatus, ProjectRole} from "../model/enums";
import {canUserEditTask, convertToDate} from "../utils/commonUtils";
import {UserAPI} from "../api/UserAPI";
import {AuthContext, AuthContextType} from "../context/AuthContext";
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteConfirmationDialog from "../componens/dialog/DeleteConfirmationDialog";
import {withBackdropLoading, WithBackdropLoadingProps} from "../componens/common/feedback/BackdropLoading";

interface TaskDetailProps extends WithLoadingProps, WithSnackbarProps, WithBackdropLoadingProps {

}

const TaskDetail: React.FC<TaskDetailProps> = (props) => {
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
    const {currentUser} = useContext(AuthContext) as AuthContextType
    const [task, setTask] = useState<Task | undefined>()
    const [projectName, setProjectName] = useState<string>()
    const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([])
    const [editDescription, setEditDescription] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)
    const [editable, setEditable] = useState<boolean>(false)
    const [userProjectRole, setUserProjectRole] = useState<ProjectRole>()

    type DeleteConfirmationDialogHandle = React.ElementRef<typeof DeleteConfirmationDialog>
    const deleteDialogRef = React.useRef<DeleteConfirmationDialogHandle>(null)

    useEffect(() => {
        startLoading()
        if (id) {
            const idAsNum = parseInt(id)
            if (idAsNum && idAsNum > 0) {
                TaskAPI.get(idAsNum)
                    .then(taskResponse => {
                        if (taskResponse.isSuccessful) {
                            setTask(taskResponse.data)
                            if (taskResponse.data?.progress) setProgress(taskResponse.data?.progress)

                            if (taskResponse.data) {
                                const projectId = taskResponse.data.projectId
                                ProjectAPI.getProjectMembers(projectId, ProjectMemberStatus.ACTIVE)
                                    .then(response => {
                                        if (response.isSuccessful && response.data)
                                            setProjectMembers(response.data)
                                    })

                                ProjectAPI.getName(projectId)
                                    .then(response => {
                                        if (response.isSuccessful)
                                            setProjectName(response.data)
                                    })

                                UserAPI.getUserRoleInProject(currentUser.id, projectId)
                                    .then(response => {
                                        if (response.isSuccessful) {
                                            setUserProjectRole(response.data)
                                            setEditable(canUserEditTask(currentUser.id, taskResponse.data?.assignedUserId, response.data))
                                        }
                                    })
                            }
                        }
                        stopLoading()
                    })
            }
        }
    }, [id])

    const updateTask = (task: Task) => {
        TaskAPI.update(task)
            .then(response => {
                if (!response.isSuccessful) {
                    showAlert(t("common.somethingWentWrong"), 'error')
                }
                setEditable(canUserEditTask(currentUser.id, task.assignedUserId, userProjectRole))
            })
    }

    const handleCloseDeleteConfirmationDialog = (isConfirmed: boolean, taskId: number) => {
        if (isConfirmed) {
            openBackdropLoading()
            TaskAPI.delete(taskId)
                .then(response => {
                    closeBackdropLoading()
                    if (!response.isSuccessful) {
                        showAlert(t("common.somethingWentWrong"), 'error')
                    } else {
                        navigate("/ui/projects/" + task?.projectId)
                    }
                })
        }
    }

    const deleteTask = () => {
        deleteDialogRef?.current?.handleOpenMenu(task?.id)
    }

    const handleChangeValue = (newValue: any, valueName: string): void => {
        if (task) {
            // @ts-ignore
            if (task[valueName] !== newValue) {
                setTask(prevState => {
                    // @ts-ignore
                    prevState[valueName] = newValue
                    return prevState
                })
                updateTask(task)
            }
        }
    }

    return (
        task ?
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
                        variant='outlined'
                        label={projectName}
                        onClick={() => {
                            navigate("/ui/projects/" + task?.projectId)
                        }}
                    />
                    <Chip
                        clickable
                        size='small'
                        color='secondary'
                        variant='filled'
                        label={task.name}
                        onClick={() => {
                            navigate("/ui/projects/" + task?.projectId + "/tasks/" + task?.id)
                        }}
                    />
                </Breadcrumbs>
                <Divider sx={{my: 1}}/>
                <Box display='flex' alignItems='center'>
                    <Box
                        flexGrow={1}
                        display='flex'
                        alignItems='center'
                    >
                        <TaskIcon fontSize='large' sx={{mr: 1}}/>
                        {editable ?
                            <EditableTypography variant='h6' initValue={task.name}
                                                onChange={value => handleChangeValue(value, 'name')}/>
                            :
                            <Typography variant="h6">{task.name}</Typography>
                        }
                    </Box>
                    <Box>
                        <Button size='small' color='error' startIcon={<DeleteIcon/>} onClick={() => deleteTask()}>
                            {t("common.delete")}
                        </Button>
                    </Box>
                </Box>

                <Stack sx={{my: 2}}>
                    {editDescription && editable ?
                        <EditableTypography variant='subtitle1' initValue={task.description}
                                            onChange={value => {
                                                handleChangeValue(value.trim(), 'description')
                                                setEditDescription(false)
                                            }}/>
                        :
                        <Typography
                            variant='subtitle1'
                            onClick={() => setEditDescription(true)}

                            sx={{
                                border: 1,
                                p: 1,
                                fontStyle: task.description ? '' : 'italic',
                                borderRadius: 2,
                                borderColor: 'white',
                                "&:hover": {
                                    borderColor: grey[500]
                                }
                            }}
                        >
                            {task.description ? task.description : 'Popis ...'}
                        </Typography>
                    }
                </Stack>

                <Grid container columnSpacing={2} rowSpacing={2}>
                    <Grid item xs={12} xl={6}>
                        {/*1st ROW*/}
                        <Typography variant='button' mt={3} color={grey[600]}>
                            {t("common.details")}
                        </Typography>

                        <Divider sx={{my: 1}}/>

                        <Grid container direction="row" spacing={2} mb={2}>
                            <Grid item xs={12} lg={6}>
                                <Grid container direction="row" alignItems='center'>
                                    <Grid item xs={12} sm={3}>
                                        <Typography fontWeight='bold'>
                                            {t("common.status")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={10} md={8}>
                                        <StatusSelect
                                            readOnly={!editable}
                                            name='status'
                                            hideLabel
                                            defaultValue={task.status !== null ? task.status : undefined}
                                            onChange={event => handleChangeValue(event.target.value, 'status')}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <Grid container direction="row" alignItems='center'>
                                    <Grid item xs={12} sm={3}>
                                        <Typography fontWeight='bold'>
                                            {t("common.priority")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={10} md={8}>
                                        <PrioritySelect
                                            readOnly={!editable}
                                            name='priority'
                                            hideLabel
                                            defaultValue={task.priority !== null ? task.priority : undefined}
                                            onChange={event => handleChangeValue(event.target.value, 'priority')}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" spacing={2} mb={2}>
                            <Grid item xs={12} lg={6}>
                                <Grid container direction="row" alignItems='center'>
                                    <Grid item xs={12} sm={3}>
                                        <Typography fontWeight='bold'>
                                            {t("common.start")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={10} md={8}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                format="DD.MM.YYYY"
                                                readOnly={!editable}
                                                name="startDate"
                                                onChange={value => value && handleChangeValue(convertToDate(value), "startDate")}
                                                value={dayjs(task.startDate)}
                                                slotProps={{
                                                    textField: {
                                                        size: 'small'
                                                    }
                                                }}
                                                sx={{
                                                    width: '100%'
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <Grid container direction="row" alignItems='center'>
                                    <Grid item xs={12} sm={3}>
                                        <Typography fontWeight='bold'>
                                            {t("common.end")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={10} md={8}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                format="DD.MM.YYYY"
                                                readOnly={!editable}
                                                name="endDate"
                                                onChange={value => value && handleChangeValue(convertToDate(value), "endDate")}
                                                value={dayjs(task.endDate)}
                                                slotProps={{
                                                    textField: {
                                                        size: 'small'
                                                    }
                                                }}
                                                sx={{
                                                    width: '100%'
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container direction="row" spacing={2}>
                            <Grid item xs={12} lg={6}>
                                <Grid container direction="row" alignItems='center'>
                                    <Grid item xs={12} sm={3}>
                                        <Typography fontWeight='bold'>
                                            {t("common.assignedUser")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={10} md={8}>
                                        <UserSelect
                                            readOnly={!editable}
                                            hideLabel
                                            projectMembers={projectMembers}
                                            assignedUser={task.assignedUserId?.toString()}
                                            name='user-select'
                                            onChange={event => handleChangeValue(
                                                event.target.value ? parseInt(event.target.value) : undefined,
                                                'assignedUserId'
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} lg={6}>
                                <Grid container direction="row" alignItems='center'>
                                    <Grid item xs={12} sm={3}>
                                        <Typography fontWeight='bold'>
                                            {t("common.progress")}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={10} md={8}>
                                        <Slider
                                            disabled={!editable}
                                            aria-label="Progress"
                                            value={progress}
                                            onChange={(_, newValue) => {
                                                if (!Array.isArray(newValue)) {
                                                    setProgress(newValue)
                                                }
                                            }}
                                            onChangeCommitted={(_, newValue) => {
                                                if (!Array.isArray(newValue)) {
                                                    task.progress = newValue
                                                    updateTask(task)
                                                }
                                            }}
                                            step={1}
                                            marks={[{
                                                value: 0,
                                                label: '0%',
                                            },
                                                {
                                                    value: 100,
                                                    label: '100%',
                                                }]}
                                            valueLabelDisplay="auto"/>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Divider sx={{my: 2}}/>

                    </Grid>
                    <Grid item xs={12} xl={6}>
                        <Typography variant='button' mt={3} color={grey[600]}>
                            {t("task.relatedTasks")}
                        </Typography>

                        <Divider sx={{my: 1}}/>

                        <RelatedTasksAccordion
                            projectId={task.projectId}
                            taskId={task.id}
                            initRelatedTasks={task.taskPredecessor}
                            summaryTitle={t("task.previousActivities")}
                            swappedRelationship={false}
                            addButtonTitle={t("task.addPreviousActivities")}
                            editable={editable}
                        />

                        <RelatedTasksAccordion
                            projectId={task.projectId}
                            taskId={task.id}
                            initRelatedTasks={task.taskSuccessor}
                            summaryTitle={t("task.followingActivities")}
                            swappedRelationship={true}
                            addButtonTitle={t("task.addFollowingActivities")}
                            editable={editable}
                        />
                    </Grid>
                </Grid>
                <DeleteConfirmationDialog ref={deleteDialogRef} handleClose={handleCloseDeleteConfirmationDialog}/>
            </Stack>
            : <></>
    )
}

export default withBackdropLoading(withSnackbar(withLoading(TaskDetail)))