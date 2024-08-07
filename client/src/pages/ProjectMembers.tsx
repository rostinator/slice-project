import React, {useEffect, useState} from "react";
import {Box, Button, Chip, Divider, Stack, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router";
import {withLoading, WithLoadingProps} from "../componens/common/feedback/Loading";
import {ProjectAPI} from "../api/ProjectAPI";
import {Nullable, ProjectMember} from "../model/models";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import GroupsIcon from '@mui/icons-material/Groups';
import {useTranslation} from "react-i18next";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import IconButtonSmall from "../componens/common/IconButtonSmall";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {formatDateTime} from "../utils/commonUtils";
import MenuItemAvatar from "../componens/common/inputs/MenuItemAvatar";
import {red} from "@mui/material/colors";
import SelectProjectRoleMenu from "../componens/common/inputs/menu/SelectProjectRoleMenu";
import {ProjectRole} from "../model/enums";
import {withSnackbar, WithSnackbarProps} from "../componens/common/feedback/Snackbar";
import DeleteConfirmationDialog from "../componens/dialog/DeleteConfirmationDialog";
import {projectMemberStatusIcons} from "../componens/common/inputs/EnumIcons";
import CreateProjectMemberDialog from "../componens/dialog/CreateProjectMemberDialog";
interface ProjectMembersProps extends WithLoadingProps, WithSnackbarProps {

}

const ProjectMembers: React.FC<ProjectMembersProps> = (props) => {
    const {
        startLoading,
        stopLoading,
        showAlert,
    } = props

    const {id} = useParams()
    const {t} = useTranslation()
    const navigate = useNavigate()

    const [projectName, setProjectName] = useState<string>()
    const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([])
    const [openProjectMemberDialog, setOpenProjectMemberDialog] = useState<boolean>(false)

    type DeleteConfirmationDialogHandle = React.ElementRef<typeof DeleteConfirmationDialog>
    const deleteDialogRef = React.useRef<DeleteConfirmationDialogHandle>(null)

    const projectMemberStatusIconMap = new Map(projectMemberStatusIcons.map(obj => [obj.item, obj.icon]));

    useEffect(() => {
        startLoading()
        if (id) {
            const idAsNum = parseInt(id)
            if (idAsNum) {
                const getData = async () => {
                    const data = await Promise.all([
                        ProjectAPI.getName(idAsNum), ProjectAPI.getAllProjectMembers(idAsNum)
                    ])

                    if (data[0].isSuccessful) {
                        setProjectName(data[0].data)
                    }

                    if (data[1].isSuccessful && data[1].data) {
                        setProjectMembers(data[1].data)
                    }
                    stopLoading()
                }
                getData()
            }
        }
    }, [id])

    const handleCloseCreateProjectMemberDialog= (projectMember?: ProjectMember) => {
        if (projectMember) {
            setProjectMembers(prevState => {
                prevState = [...prevState, projectMember]
                return prevState
            })
        }

        setOpenProjectMemberDialog(false)
    }

    const handleDelete = (userId: number) => {
        deleteDialogRef?.current?.handleOpenMenu(userId)
    }

    const handleCloseDeleteConfirmationDialog = (isConfirmed: boolean, userId: number) => {
        if (isConfirmed) {
            if (!id || !parseInt(id)) return

            ProjectAPI.deleteProjectMember(parseInt(id), userId)
                .then(response => {
                    if (response.isSuccessful) {
                        setProjectMembers(prevState => prevState.filter(pm => pm.userId !== userId))
                        showAlert(t("project.successfullyDeletedMember"), "success")
                    } else {
                        showAlert(t("common.somethingWentWrong"), "warning")
                    }
                })
        }
    }

    const handleChangeRole = (projectMember: ProjectMember, newValue: Nullable<ProjectRole>) => {
        if (newValue == null || projectMember.role === newValue || !id)
            return

        ProjectAPI.changeProjectMemberRole(parseInt(id), projectMember.userId, newValue)
            .then(response => {
                if (response.isSuccessful) {
                    showAlert(t("project.updateMemberRole"), "success")
                } else {
                    showAlert(t("common.somethingWentWrong"), "error")
                }
            })
    }

    const columns: GridColDef<ProjectMember>[] = [
        {
            field: 'firstName',
            headerName: t("user.fullName"),
            // width: 250,
            flex: 0.1,
            minWidth: 250,
            editable: false,
            renderCell: (params) => (
                <MenuItemAvatar firstName={params.row.firstName} lastName={params.row.lastName}/>
            ),
        },
        {
            field: 'email',
            headerName: t("user.email"),
            flex: 0.2,
            minWidth: 200,
            sortable: true,
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'role',
            headerName: t("project.role"),
            width: 200,
            sortable: true,
            align: 'center',
            headerAlign: 'left',
            renderCell: (params) => (
                <SelectProjectRoleMenu
                    initValue={params.row.role}
                    onChange={(role) => handleChangeRole(params.row, role)}
                    width={200}
                />
            ),
        },
        {
            field: 'status',
            headerName: t("common.status"),
            width: 200,
            editable: false,
            renderCell: (params) => (
                <Stack spacing={1} alignItems='center' direction='row'>
                    {projectMemberStatusIconMap.get(params.row.status)}
                    <Typography>{t(`projectMemberStatus.${params.row.status}`)}</Typography>
                </Stack>
            ),
        },
        {
            field: 'createdDateTime',
            headerName: t("common.createdDate"),
            type: 'dateTime',
            width: 200,
            editable: false,
            valueFormatter: params => formatDateTime(params?.value),
        },
        {
            field: 'updatedDateTime',
            headerName: t("common.updatedDate"),
            type: 'dateTime',
            width: 200,
            editable: false,
            valueFormatter: params => formatDateTime(params?.value),
        },
        {
            field: 'remove',
            headerName: '',
            type: 'actions',
            width: 30,
            sortable: false,
            align: 'center',
            headerAlign: 'left',
            renderCell: (params) => (
                <IconButtonSmall
                    icon={<DeleteForeverIcon fontSize='small' htmlColor={red[900]}/>}
                    onClick={() => handleDelete(params.row.userId)}
                />
            ),
        }
    ];

    return (
        projectName && projectMembers?.length > 0 ?
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
                            navigate(`/ui/projects/${id}`)
                        }}
                    />
                    <Chip
                        clickable
                        size='small'
                        color='secondary'
                        variant='filled'
                        label={t("project.members")}
                        onClick={() => {
                            navigate(`/ui/projects/${id}/members`)
                        }}
                    />
                </Breadcrumbs>
                <Divider sx={{my: 2}}/>

                <Box p={1} display='flex' mb={1}>
                    <Box flexGrow={1} display='flex' alignItems='center'>
                        <GroupsIcon fontSize='large' sx={{mr: 2}}/>
                        <Typography variant='h5'>{`${t("project.projectMembers")} ${projectName}`}</Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        size='small'
                        color="secondary"
                        startIcon={<GroupAddIcon/>}
                        onClick={() => setOpenProjectMemberDialog(true)}
                    >
                        {t("common.add")}
                    </Button>
                </Box>

                <DataGrid
                    columns={columns}
                    rows={projectMembers}
                    editMode='cell'
                    density='compact'
                    getRowId={(row) => row?.userId}
                    // processRowUpdate={processRowUpdate}
                    hideFooter
                    hideFooterSelectedRowCount
                    sx={{'& .MuiDataGrid-cell:focus-within': {outline: 'none'}}}
                />

                <DeleteConfirmationDialog ref={deleteDialogRef} handleClose={handleCloseDeleteConfirmationDialog}/>
                <CreateProjectMemberDialog
                    handleClose={handleCloseCreateProjectMemberDialog}
                    open={openProjectMemberDialog}
                    projectId={id && parseInt(id) ? parseInt(id) : -1}
                />
            </Stack>
            : <></>
    )

}

export default withSnackbar(withLoading(ProjectMembers))