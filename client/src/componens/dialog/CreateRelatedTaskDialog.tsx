import React, {useEffect, useState} from "react";
import {withSnackbar, WithSnackbarProps} from "../common/feedback/Snackbar";
import FormDialog from "./FormDialog";
import RelatedTaskSelect from "../common/inputs/select/RelatedTaskSelect";
import {TaskAPI} from "../../api/TaskAPI";
import {Task} from "../../model/models";
import {DialogContent} from "@mui/material";
import yup from "../../validation";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useTranslation} from "react-i18next";

const projectSchema = yup.object({
    relatedTaskId: yup.number(),
}).required()

export type CreateTaskRelationshipFormData = yup.InferType<typeof projectSchema>

interface CreateRelatedTaskDialogProps extends WithSnackbarProps {
    open: boolean;
    taskId: number;
    swappedRelationship: boolean;
    title: string;
    taskSelectTitle: string;
    handleClose(update: boolean): void;
}

const CreateRelatedTaskDialog: React.FC<CreateRelatedTaskDialogProps> = (props) => {
    const {
        open,
        taskId,
        swappedRelationship,
        title,
        taskSelectTitle,
        handleClose,
        showAlert
    } = props

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<CreateTaskRelationshipFormData>({
        resolver: yupResolver(projectSchema)
    })

    const{t} = useTranslation()

    const [errorMsg, setErrorMsg] = useState<string | undefined>()
    const [availableNotRelatedTask, setAvailableNotRelatedTask] = useState<Task[]>([])
    const [selectedTask, setSelectedTask] = useState<string>('')

    useEffect(() => {
        if (taskId && open) {
            TaskAPI.getNotRelatedTask(taskId)
                .then(response => {
                    if (response.isSuccessful && response.data)
                        setAvailableNotRelatedTask(response.data)
                })
        }
    }, [taskId, open])

    const onSubmit = (data: CreateTaskRelationshipFormData): void => {
        if (selectedTask.length > 0) {
            TaskAPI.createRelationship(swappedRelationship ? parseInt(selectedTask) : taskId, swappedRelationship ? taskId : parseInt(selectedTask))
                .then(response => {
                    if (response.isSuccessful) {
                        showAlert(t("task.relationSucCreated"), 'success');
                        handleCloseButton(true)
                    } else {
                        setErrorMsg(response.errorMessage)
                    }
                })
        } else {
            setErrorMsg(t("task.selectRelatedTask"))
        }
    }

    const handleCloseButton = (update: boolean): void => {
        handleClose(update)
        setSelectedTask('')
    }

    return (
        <FormDialog
            open={open}
            onSubmit={handleSubmit(onSubmit)}
            handleCloseButton={() => handleCloseButton(false)}
            errorMessage={errorMsg}
            title={title}
        >
            <DialogContent sx={{px: 6}}>
                <RelatedTaskSelect availableRelatedTasks={availableNotRelatedTask} value={selectedTask} setValue={setSelectedTask} label={taskSelectTitle} />
            </DialogContent>
        </FormDialog>
    )
}

export default withSnackbar(CreateRelatedTaskDialog)