import React from "react";
import {Box, Button, Stack} from "@mui/material";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Nullable, ProjectMember, Task} from "../../model/models";
import SelectStatusMenu from "../common/inputs/menu/SelectStatusMenu";
import {Priority, Status} from "../../model/enums";
import SelectPriorityMenu from "../common/inputs/menu/SelectPriorityMenu";
import {TaskAPI} from "../../api/TaskAPI";
import {WithSnackbarProps, withSnackbar} from "../common/feedback/Snackbar";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButtonSmall from "../common/IconButtonSmall";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {useNavigate} from "react-router";
import SelectUserMenu from "../common/inputs/menu/SelectUserMenu";
import {useTranslation} from "react-i18next";
import TaskIdLink from "./TaskIdLink";

interface TaskDataGridPanelProps extends WithSnackbarProps {
    tasks: Task[];
    openCreateTaskDialog(): void;
    availableProjectMembers: ProjectMember[];
}

const TaskDataGridPanel: React.FC<TaskDataGridPanelProps> = (props) => {

    const {
        tasks,
        openCreateTaskDialog,
        showAlert,
        availableProjectMembers,
    } = props

    const navigate = useNavigate()
    const {t} = useTranslation()

    const projectMembersMap = new Map(availableProjectMembers.map(user => [user.userId, user]));

    const processRowUpdate = (newRow: Task, oldRow: Task): Task => {
        if (newRow.name.length === 0) {
            showAlert(t("task.taskNameMustFilled"), 'warning')
            return oldRow
        }

        let doUpdate: boolean = false

        if (newRow.name !== oldRow.name) {
            oldRow.name = newRow.name
            doUpdate = true
        }

        if (newRow.startDate !== oldRow.startDate) {
            oldRow.startDate = newRow.startDate
            doUpdate = true
        }

        if (newRow.endDate !== oldRow.endDate) {
            oldRow.endDate = newRow.endDate
            doUpdate = true
        }

        if (doUpdate) {
            updateTask(oldRow)
        }

        return newRow
    };

    const updateTask = (task: Task) => {
        TaskAPI.update(task)
            .then(response => {
                if (!response.isSuccessful) {
                    showAlert(t("common.somethingWentWrong"), 'error')
                }
            })
    }

    const handleChangePriority = (task: Task, newValue: Nullable<Priority>) => {
        if (task.priority !== newValue) {
            task.priority = newValue
            updateTask(task)
        }
    }

    const handleChangeStatus = (task: Task, newValue: Nullable<Status>) => {
        if (task.status !== newValue) {
            task.status = newValue
            updateTask(task)
        }
    }

    const handleChangeAssignedUser = (task: Task, newValue?: ProjectMember) => {
        if (newValue && task.assignedUserId !== newValue.userId) {
            task.assignedUserId = newValue.userId
            updateTask(task)
        } else if (!newValue && task.assignedUserId){
            task.assignedUserId = undefined
            updateTask(task)
        }
    }

    const columns: GridColDef<Task>[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            renderCell: (params) => (
                <TaskIdLink projectId={params.row.projectId} taskId={params.row.id} />
            ),
        },
        {
            field: 'name',
            headerName: t("task.name"),
            minWidth: 250,
            flex: 0.1,
            editable: true,
        },
        {
            field: 'status',
            headerName: t("common.status"),
            type: 'actions',
            width: 200,
            sortable: true,
            align: 'left',
            headerAlign: 'left',
            renderCell: (params) => (
                <SelectStatusMenu initValue={params.row.status}
                                  onChange={(status) => handleChangeStatus(params.row, status)}
                                  width={200}
                />
            ),
        },
        {
            field: 'priority',
            headerName: t("common.priority"),
            type: 'actions',
            width: 200,
            sortable: true,
            align: 'left',
            headerAlign: 'left',
            renderCell: (params) => (
                <SelectPriorityMenu initValue={params.row.priority}
                                    onChange={(priority) => handleChangePriority(params.row, priority)}
                                    width={200}
                />
            ),
        },
        // {
        //     field: 'startDate',
        //     headerName: 'Start date',
        //     type: 'date',
        //     width: 150,
        //     editable: true,
        //     valueFormatter: params => formatDate(params?.value),
        //     // renderEditCell: (params) =>(
        //     //   <GridEditDateCell {...params}
        //     //     inputProps={{
        //     //         m
        //     //     }}
        //     //   />
        //     // ),
        // },
        // {
        //     field: 'endDate',
        //     headerName: 'End date',
        //     type: 'date',
        //     width: 150,
        //     editable: true,
        //     valueFormatter: params => formatDate(params?.value),
        //     // renderEditCell: (params) =>(
        //     //   <GridEditDateCell {...params}
        //     //     inputProps={{
        //     //         m
        //     //     }}
        //     //   />
        //     // ),
        // },
        {
            field: 'assignedUser',
            headerName: t("common.assignedUser"),
            type: 'actions',
            width: 200,
            sortable: true,
            align: 'left',
            headerAlign: 'left',
            renderCell: (params) => (
                <SelectUserMenu
                    initValue={params.row.assignedUserId ? projectMembersMap.get(params.row.assignedUserId) : undefined}
                    availableProjectMembers={availableProjectMembers}
                    onChange={(assignedUser) => handleChangeAssignedUser(params.row, assignedUser)}
                    width={200}
                />
            ),
        },
        {
            field: 'linkToTaskDetail',
            headerName: '',
            type: 'actions',
            width: 30,
            sortable: false,
            align: 'center',
            headerAlign: 'left',
            renderCell: (params) => (
                <IconButtonSmall
                    icon={<KeyboardArrowRightIcon fontSize='small'/>}
                    onClick={() => navigate(`tasks/${params.row.id}`)}
                />
            ),
        }
    ];

    return (
        <Stack
            spacing={1}
        >
            {tasks.length > 0 ? (
                <DataGrid
                    columns={columns}
                    rows={tasks}
                    editMode='cell'
                    density='compact'
                    processRowUpdate={processRowUpdate}
                    pageSizeOptions={[10]}
                    hideFooterSelectedRowCount
                    sx={{'& .MuiDataGrid-cell:focus-within': {outline: 'none'}}}
                />
            ) : (
                <>
                </>
            )}
            <Box>
                <Button
                    size='small'
                    variant='outlined'
                    startIcon={<AddCircleOutlineIcon fontSize='small'/>}
                    onClick={() => openCreateTaskDialog()}
                >
                    {t("task.add")}
                </Button>
            </Box>
        </Stack>
    )
}

export default withSnackbar(TaskDataGridPanel)