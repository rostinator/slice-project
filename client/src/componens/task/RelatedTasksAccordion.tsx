import React, {useState} from "react";
import {
    Accordion,
    AccordionActions,
    AccordionDetails,
    AccordionSummary, Box, Button, IconButton,
    Link, Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {useNavigate} from "react-router";
import {RelatedTask} from "../../model/models";
import {TaskAPI} from "../../api/TaskAPI";
import {withBackdropLoading, WithBackdropLoadingProps} from "../common/feedback/BackdropLoading";
import {withSnackbar, WithSnackbarProps} from "../common/feedback/Snackbar";
import CreateRelatedTaskDialog from "../dialog/CreateRelatedTaskDialog";
import {useTranslation} from "react-i18next";
import {statusIcons, statusIconsMap} from "../common/inputs/EnumIcons";

interface RelatedTasksAccordionProps extends WithSnackbarProps, WithBackdropLoadingProps {
    projectId: number;
    taskId: number;
    initRelatedTasks: RelatedTask[];
    summaryTitle: string;
    swappedRelationship: boolean;
    addButtonTitle: string;
    editable: boolean;
}

const RelatedTasksAccordion: React.FC<RelatedTasksAccordionProps> = (props) => {
    const {
        projectId,
        taskId,
        initRelatedTasks,
        summaryTitle,
        swappedRelationship,
        addButtonTitle,
        showAlert,
        openBackdropLoading,
        closeBackdropLoading,
        editable,
    } = props

    const navigate = useNavigate()
    const {t} = useTranslation()
    const [relatedTasks, setRelatedTasks] = useState<RelatedTask[]>(initRelatedTasks)
    const [openCreateRelationDialog, setOpenCreateRelationDialog] = useState<boolean>(false)

    const deleteRelationship = (relatedTaskId: number) => {
        openBackdropLoading()
        TaskAPI.deleteRelationship(swappedRelationship ? relatedTaskId : taskId, swappedRelationship ? taskId : relatedTaskId)
            .then(response => {
                if (response.isSuccessful) {
                    setRelatedTasks(prevState => prevState.filter(value => value.relatedTaskId != relatedTaskId))
                    showAlert(t("common.deleted"), 'info')
                } else {
                    showAlert(t("common.somethingWentWrong"), 'error')
                }
                closeBackdropLoading()
            })
    }

    const handleCloseRelatedTaskDialog = (update: boolean) => {
        setOpenCreateRelationDialog(false)

        if (update) {
            openBackdropLoading()
            if (swappedRelationship) {
                TaskAPI.getTaskSuccessor(taskId)
                    .then(response => {
                        if (response.isSuccessful && response.data) {
                            setRelatedTasks(response.data)
                        }
                        closeBackdropLoading()
                    })
            } else {
                TaskAPI.getTaskPredecessor(taskId)
                    .then(response => {
                        if (response.isSuccessful && response.data) {
                            setRelatedTasks(response.data)
                        }
                        closeBackdropLoading()
                    })
            }
        }
    }

    return (
        <>
            <Accordion defaultExpanded disableGutters variant='outlined' sx={{mb: 1}}>
                <AccordionSummary
                    expandIcon={<KeyboardArrowDownIcon/>}
                >
                    <Typography fontWeight='bold'>{summaryTitle}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Table aria-label="simple table" size="small">
                        <TableBody>
                            {relatedTasks.map((row) => (
                                <TableRow
                                    key={row.relatedTaskId}
                                    // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" width='70%'>
                                        <Link
                                            component="button"
                                            variant="body2"
                                            onClick={() => navigate("/ui/projects/" + projectId + "/tasks/" + row.relatedTaskId)}
                                        >
                                            {row.taskName}
                                        </Link>

                                    </TableCell>
                                    <TableCell align="left" width='20%'>
                                        <Stack spacing={1} alignItems='center' direction='row'>
                                            {statusIconsMap.get(row.taskStatus)}
                                            <Typography>{t(`status.${row.taskStatus}`)}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right" width='10%'>
                                        <IconButton
                                            aria-label="delete"
                                            sx={{p: '1px'}}
                                            onClick={() => deleteRelationship(row.relatedTaskId)}
                                            disabled={!editable}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>

                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </AccordionDetails>
                <AccordionActions>
                    <Button
                        variant='outlined'
                        size='small'
                        startIcon={<AddCircleOutlineIcon fontSize='small'/>}
                        onClick={() => setOpenCreateRelationDialog(true)}
                        disabled={!editable}
                    >
                        {addButtonTitle}
                    </Button>
                </AccordionActions>
            </Accordion>
            <CreateRelatedTaskDialog
                open={openCreateRelationDialog}
                taskId={taskId}
                swappedRelationship={swappedRelationship}
                handleClose={handleCloseRelatedTaskDialog}
                title={addButtonTitle}
                taskSelectTitle={summaryTitle}
            />
        </>
    );
}

export default withBackdropLoading(withSnackbar(RelatedTasksAccordion))