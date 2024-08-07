import React, {useContext, useEffect, useState} from "react";
import {withLoading, WithLoadingProps} from "../componens/common/feedback/Loading";
import {withSnackbar, WithSnackbarProps} from "../componens/common/feedback/Snackbar";
import {Project} from "../model/models";
import {
    Box,
    Button,
    Chip,
    Divider,
    Link,
    Paper,
    Stack, Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {UserAPI} from "../api/UserAPI";
import {AuthContext, AuthContextType} from "../context/AuthContext";
import {useTranslation} from "react-i18next";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import {useNavigate} from "react-router";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import {projectStatusIconsMap, projectTypeIconsSmallMap} from "../componens/common/inputs/EnumIcons";
import CreateProjectDialog from "../componens/dialog/CreateProjectDialog";

interface ProjectProps extends WithLoadingProps, WithSnackbarProps {

}

const Projects: React.FC<ProjectProps> = (props) => {
    const {
        showAlert,
        stopLoading,
    } = props

    const {t} = useTranslation()
    const navigate = useNavigate()
    const {currentUser} = useContext(AuthContext) as AuthContextType

    const [projects, setProjects] = useState<Project[]>()
    const [openProjectDialog, setOpenProjectDialog] = useState<boolean>(false)

    useEffect(() => {
        if (currentUser) {
            UserAPI.getAllProjects(currentUser.id)
                .then(response => {
                    if (response.isSuccessful) {
                        setProjects(response.data)
                    } else {
                        showAlert(t("common.somethingWentWrong"), 'error')
                    }
                    stopLoading()
                })
        }
    }, [currentUser])

    const handleCloseProjectDialog = (project?: Project) => {
        if (project)
            setProjects(prevState => {
                if (!prevState) prevState = []
                prevState.push(project)
                return prevState
            })
        setOpenProjectDialog(false)
    }

    return (
        projects ?
            <Stack m={2}>
                <Breadcrumbs>
                    <Chip
                        clickable
                        size='small'
                        color='secondary'
                        variant='filled'
                        label={t("project.projects")}
                        onClick={() => {
                            navigate("/ui/projects")
                        }}
                    />
                </Breadcrumbs>
                <Divider sx={{my: 2}}/>

                <Box p={1} display='flex' mb={1}>
                    <Box flexGrow={1} display='flex' alignItems='center'>
                        <FormatListBulletedIcon fontSize='large' sx={{mr: 2}}/>
                        <Typography variant='h5'>{t("project.projects")}</Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        size='small'
                        color="secondary"
                        startIcon={<PlaylistAddIcon/>}
                        onClick={() => setOpenProjectDialog(true)}
                    >
                        {t("project.create")}
                    </Button>
                </Box>

                <Paper variant='outlined' sx={{p: 1.5}}>
                    <Table aria-label="simple table" size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("common.name")}</TableCell>
                                <TableCell align="right">{t("common.type")}</TableCell>
                                <TableCell align="right">{t("common.status")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projects?.map((row) => (
                                <TableRow
                                    key={row.id}
                                    // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" width='60%'>
                                        <Link
                                            component="button"
                                            variant="body1"
                                            onClick={() => navigate("/ui/projects/" + row.id)}
                                        >
                                            {row.name}
                                        </Link>

                                    </TableCell>
                                    <TableCell align="right" width='20%'>
                                        <Stack spacing={1} alignItems='center' direction='row-reverse'>
                                            <Typography variant="body1">{t(`projectType.${row.type}`)}</Typography>
                                            {projectTypeIconsSmallMap.get(row.type)}
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right" width='20%'>
                                        <Stack spacing={1} alignItems='center' direction='row-reverse'>
                                            <Typography variant="body1">{t(`projectStatus.${row.status}`)}</Typography>
                                            {projectStatusIconsMap.get(row.status)}
                                        </Stack>
                                    </TableCell>
                                    {/*<TableCell align="right" width='10%'>*/}
                                    {/*    <IconButton aria-label="delete" sx={{p: '1px'}}>*/}
                                    {/*                 /!*onClick={() => deleteRelationship(row.relatedTaskId)}>*!/*/}
                                    {/*        <DeleteIcon/>*/}
                                    {/*    </IconButton>*/}

                                    {/*</TableCell>*/}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
                <CreateProjectDialog open={openProjectDialog} handleClose={handleCloseProjectDialog}/>
            </Stack>
            :
            <></>
    )
}

export default withLoading(withSnackbar(Projects))