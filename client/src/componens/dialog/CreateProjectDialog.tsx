import React, {useEffect, useState} from "react";
import {DialogContent, Grid, TextField,} from "@mui/material";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {ProjectType} from "../../model/enums";
import {withSnackbar, WithSnackbarProps} from "../common/feedback/Snackbar";
import yup from "../../validation";
import FormDialog, {DEF_DIALOG_CONTENT_PX} from "./FormDialog";
import {ProjectAPI} from "../../api/ProjectAPI";
import {Project} from "../../model/models";
import {withBackdropLoading, WithBackdropLoadingProps} from "../common/feedback/BackdropLoading";
import ProjectTypeSelect from "../common/inputs/select/ProjectTypeSelect";
import {useTranslation} from "react-i18next";

const projectSchema = yup.object({
    name: yup.string().required().min(5).max(255),
    type: yup.mixed<ProjectType>().required().default(ProjectType.PRIVATE),
    description: yup.string().max(1024),
}).required()

export type CreateProjectFormData = yup.InferType<typeof projectSchema>

interface CreateProjectDialogProps extends WithSnackbarProps, WithBackdropLoadingProps {
    open: boolean;
    handleClose(project?: Project): void;
}

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = (props: CreateProjectDialogProps) => {
    const {
        open,
        showAlert,
        handleClose,
        openBackdropLoading,
        closeBackdropLoading,
    } = props

    const {t} = useTranslation()
    const [errorMsg, setErrorMsg] = useState<string | undefined>()

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<CreateProjectFormData>({
        resolver: yupResolver(projectSchema)
    })

    const onSubmit = (formData: CreateProjectFormData): void => {
        openBackdropLoading()
        ProjectAPI.create(formData)
            .then(response => {
                if (response.isSuccessful) {
                    showAlert(t("project.successfullyCreated"), 'success');
                    handleCloseButton(response.data)
                } else {
                    setErrorMsg(response.errorMessage)
                }
                closeBackdropLoading()
            })
    }

    const handleCloseButton = (project?: Project): void => {
        handleClose(project)
        setTimeout(function () {
            setErrorMsg(undefined)
            reset()
        }, 1000);
    }

    return (
        <FormDialog
            open={open}
            onSubmit={handleSubmit(onSubmit)}
            handleCloseButton={() => handleCloseButton()}
            errorMessage={errorMsg}
            title={t("project.createDialogTitle")}
        >
            <DialogContent sx={{px: DEF_DIALOG_CONTENT_PX}}>
                <Grid
                    container
                    direction="row"
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <TextField
                            required
                            {...register("name")}
                            fullWidth
                            size="small"
                            margin="none"
                            label={t("common.name")}
                            error={!!errors.name}
                            helperText={errors.name?.message ? t(errors.name.message) : ''}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ProjectTypeSelect
                            name={register("type").name}
                            onBlur={register("type").onBlur}
                            onChange={register("type").onChange}
                            error={!!errors.type}
                            text={errors.type?.message ? t(errors.type.message) : ''}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            {...register("description")}
                            fullWidth
                            multiline
                            maxRows={8}
                            size="small"
                            margin="none"
                            label={t("common.description")}
                            error={!!errors.description}
                            helperText={errors.description?.message ? t(errors.description?.message) : ''}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </FormDialog>
    )
}

export default withBackdropLoading(withSnackbar(CreateProjectDialog))