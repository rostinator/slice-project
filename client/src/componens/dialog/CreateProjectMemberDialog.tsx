import React, {useState} from "react";
import FormDialog from "./FormDialog";
import {ProjectMember} from "../../model/models";
import yup from "../../validation";
import {ProjectRole} from "../../model/enums";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {DialogContent, Grid, TextField} from "@mui/material";
import {useTranslation} from "react-i18next";
import ProjectRoleSelect from "../common/inputs/select/ProjectRoleSelect";
import {withBackdropLoading, WithBackdropLoadingProps} from "../common/feedback/BackdropLoading";
import {withSnackbar, WithSnackbarProps} from "../common/feedback/Snackbar";
import {ProjectAPI} from "../../api/ProjectAPI";

const projectMemberSchema = yup.object({
    email: yup.string().required().email(),
    role: yup.mixed<ProjectRole>(),
}).required()

export type CreateProjectMemberFormData = yup.InferType<typeof projectMemberSchema>

interface CreateProjectMemberDialogProps extends WithBackdropLoadingProps, WithSnackbarProps {
    open: boolean;
    handleClose(projectMember?: ProjectMember): void;
    projectId: number;
}

const CreateProjectMemberDialog: React.FC<CreateProjectMemberDialogProps> = (props) => {
    const {
        open,
        handleClose,
        projectId,
        openBackdropLoading,
        closeBackdropLoading,
        showAlert,
    } = props

    const {t} = useTranslation()

    const [errorMsg, setErrorMsg] = useState<string | undefined>()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        trigger,
        formState: {errors}
    } = useForm<CreateProjectMemberFormData>({
        resolver: yupResolver(projectMemberSchema)
    })

    const onSubmit = (formData: CreateProjectMemberFormData): void => {
        openBackdropLoading()
        setErrorMsg(undefined)
        ProjectAPI.createProjectMember(projectId, formData)
            .then(response => {
                if (response.isSuccessful) {
                    showAlert(t("project.successfullyCreatedMember"), "success")
                    handleCloseButton(response.data)
                } else {
                    setErrorMsg(response.errorMessage)
                }
                closeBackdropLoading()
            })
    }

    const handleCloseButton = (projectMember?: ProjectMember): void => {
        handleClose(projectMember)
        reset()
        setErrorMsg('')
    }

    return (
        <FormDialog
            open={open}
            onSubmit={handleSubmit(onSubmit)}
            handleCloseButton={() => handleCloseButton()}
            errorMessage={errorMsg}
            title={t("project.createProjectMemberTitle")}
        >
            <DialogContent sx={{px: 6}}>
                <Grid
                    container
                    direction="row"
                    spacing={2}
                >
                    <Grid item xs={12}>
                        <TextField
                            required
                            {...register("email")}
                            fullWidth
                            size="small"
                            margin="none"
                            label={t("user.email")}
                            error={!!errors.email}
                            helperText={errors.email?.message ? t(errors.email?.message) : ''}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ProjectRoleSelect
                            name={register("role").name}
                            onBlur={register("role").onBlur}
                            onChange={register("role").onChange}
                            error={!!errors.role}
                            text={errors.role?.message ? t(errors.role?.message) : ''}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </FormDialog>
    )
}

export default withBackdropLoading(withSnackbar(CreateProjectMemberDialog))