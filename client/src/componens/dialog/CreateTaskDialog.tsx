    import React, {useState} from "react";
import {withSnackbar, WithSnackbarProps} from "../common/feedback/Snackbar";
import yup from "../../validation";
import {Priority} from "../../model/enums";
import {
    Box,
    Chip,
    DialogContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select, SelectChangeEvent,
    TextField,
} from "@mui/material";
import FormDialog from "./FormDialog";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {TaskAPI} from "../../api/TaskAPI";
import {Nullable, ProjectMember, Task} from "../../model/models";
import PrioritySelect from "../common/inputs/select/PrioritySelect";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";
import UserSelect from "../common/inputs/select/UserSelect";
import {useTranslation} from "react-i18next";
import {convertToDate} from "../../utils/commonUtils";

const taskSchema = yup.object({
    name: yup.string().required().max(255),
    priority: yup.mixed<Priority>().default(Priority.NORMAL),
    startDate: yup.date().required(),
    endDate: yup.date().required(),
    assignedUserId: yup.string(),
    description: yup.string().max(1024),
    projectId: yup.number(),
    previousActivities: yup.array<number[]>(),
}).required()

export type CreateTaskFormData = yup.InferType<typeof taskSchema>

interface CreateTaskDialogProps extends WithSnackbarProps {
    open: boolean;
    handleClose(task?: Task): void;
    projectId: number;
    availablePreviousTasks: Task[];
    availableProjectMembers: ProjectMember[];
}

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = (props) => {
    const {
        open,
        handleClose,
        projectId,
        showAlert,
        availablePreviousTasks,
        availableProjectMembers,
    } = props

    const availableTaskItemsMap = new Map(availablePreviousTasks.map(obj => [obj.id, obj]));

    const {t} = useTranslation();

    const [errorMsg, setErrorMsg] = useState<string | undefined>()
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>();
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>();
    const [selectedPreviousTasks, setSelectedPreviousTasks] = useState<number[]>([])

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        trigger,
        formState: {errors}
    } = useForm<CreateTaskFormData>({
        resolver: yupResolver(taskSchema)
    })

    const onSubmit = (formData: CreateTaskFormData): void => {
        formData.projectId = projectId
        if (startDate?.toDate())
            formData.startDate = convertToDate(startDate)
        if (endDate?.toDate())
            formData.endDate = convertToDate(endDate)

        formData.previousActivities = selectedPreviousTasks

        TaskAPI.create(formData)
            .then(response => {
                if (response.isSuccessful) {
                    showAlert(t("task.taskSuccessfullyCreated"), 'success');
                    handleCloseButton(response.data)
                } else {
                    setErrorMsg(response.errorMessage)
                }
            })
    }

    const handleCloseButton = (task?: Task) => {
        handleClose(task)
        setTimeout(function () {
            setErrorMsg(undefined)
            setSelectedPreviousTasks([])
            reset()
        }, 1000);
    }

    const handleChange = (event: SelectChangeEvent<typeof selectedPreviousTasks>) => {
        if (Array.isArray(event.target.value))
            setSelectedPreviousTasks(event.target.value)
    }

    const handleChangeDate = async (value: Nullable<Dayjs>, name: any) => {
        setValue(name, value);
        await trigger(name);
    };

    return (
        <FormDialog
            open={open}
            onSubmit={handleSubmit(onSubmit)}
            handleCloseButton={() => handleCloseButton()}
            errorMessage={errorMsg}
            title={t("task.createDialogTitle")}
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
                            {...register("name")}
                            fullWidth
                            size="small"
                            margin="none"
                            label={t("common.name")}
                            error={!!errors.name}
                            helperText={errors.name?.message ? t(errors.name?.message) : ''}
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
                    <Grid item xs={12}>
                        <PrioritySelect
                            name={register("priority").name}
                            onBlur={register("priority").onBlur}
                            onChange={register("priority").onChange}
                            error={!!errors.priority}
                            text={errors.priority?.message ? t(errors.priority?.message) : ''}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                format="DD.MM.YYYY"
                                name={register("startDate").name}
                                onChange={value => handleChangeDate(value, register("startDate").name)}
                                label={t("common.start")}
                                minDate={dayjs()}
                                slotProps={{
                                    textField: {
                                        required: true,
                                        size: 'small',
                                        error: !!errors.startDate,
                                        helperText: errors.startDate?.message ? t(errors.startDate?.message) : ''
                                    }
                                }}
                                sx={{
                                    width: '100%'
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                format="DD.MM.YYYY"
                                name={register("endDate").name}
                                onChange={value => handleChangeDate(value, register("endDate").name)}
                                label={t("common.end")}
                                minDate={dayjs()}
                                slotProps={{
                                    textField: {
                                        required: true,
                                        size: 'small',
                                        error: !!errors.endDate,
                                        helperText: errors.endDate?.message ? t(errors.endDate?.message) : ''
                                    }
                                }}
                                sx={{
                                    width: '100%'
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                        <UserSelect
                            projectMembers={availableProjectMembers}
                            name={register("assignedUserId").name}
                            onBlur={register("assignedUserId").onBlur}
                            onChange={register("assignedUserId").onChange}
                            error={!!errors.assignedUserId}
                            text={errors.assignedUserId?.message ? t(errors.assignedUserId?.message) : ''}
                        />
                    </Grid>

                    {availablePreviousTasks && availablePreviousTasks.length > 0 &&
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel size="small" id="previous-activities-chip-label">{t("common.previousActivities")}</InputLabel>
                                <Select
                                    size="small"
                                    labelId="previous-activities-chip-label"
                                    id="previous-activities-select"
                                    multiple
                                    value={selectedPreviousTasks}
                                    onChange={handleChange}
                                    fullWidth
                                    input={<OutlinedInput size="small" id="previous-activities-select" label="Previous activities"/>}
                                    renderValue={(selected) => (
                                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={availableTaskItemsMap.get(value)?.name}/>
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {availablePreviousTasks.map((task) => (
                                        <MenuItem
                                            key={task.id}
                                            value={task.id}
                                            sx={{
                                                fontWeight: selectedPreviousTasks.indexOf(task.id) === -1 ? 'normal' : 'bold'
                                            }}
                                        >
                                            {task.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    }
                </Grid>
            </DialogContent>
        </FormDialog>
    )
}

export default withSnackbar(CreateTaskDialog)