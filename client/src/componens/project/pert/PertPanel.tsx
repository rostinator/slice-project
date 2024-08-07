import React, {useEffect, useState} from "react";
import {Task} from "../../../model/models";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Alert, Box,
    Stack,
    Typography
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InfoIcon from "../../common/InfoIcon";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {useTranslation} from "react-i18next";
import TaskIdLink from "../../task/TaskIdLink";
import {PertActivity} from "../../../methods/pert/PertActivity";
import {PertModel} from "../../../methods/pert/PertModel";
import CalculationPhaseStepper, {StepContent} from "../CalculationPhaseStepper";
import {withSnackbar, WithSnackbarProps} from "../../common/feedback/Snackbar";
import {TaskAPI} from "../../../api/TaskAPI";
import PertFirstStepCalculation from "./PertFirstStepCalculation";
import PertCriticalPathCalculation from "./PertCriticalPathCalculation";
import PertFinalStepCalculation from "./PertFinalStepCalculation";
import {red} from "@mui/material/colors";

interface PertPanelProps extends WithSnackbarProps {
    tasks: Task[];
    editable: boolean;
    projectId: number;
}

const PertPanel: React.FC<PertPanelProps> = (props) => {
    const {
        tasks,
        editable,
        projectId,
        showAlert,
    } = props

    const {t} = useTranslation()

    const taskMap: Map<number, Task> = new Map(tasks.map(obj => [obj.id, obj]))
    const [pertModel, setPertMode] = useState<PertModel>(new PertModel(tasks))

    useEffect(() => {
        setPertMode(new PertModel(tasks))
    }, tasks)

    const processRowUpdate = (newRow: PertActivity, oldRow: PertActivity): PertActivity => {

        if (newRow.optimisticEstimation !== undefined
            && newRow.modalEstimation !== undefined
            && newRow.pessimisticEstimation !== undefined
            && !(0 <= newRow.optimisticEstimation
                && newRow.optimisticEstimation <= newRow.modalEstimation
                && newRow.modalEstimation <= newRow.pessimisticEstimation)
        ) {
            showAlert(t("pert.estimationConditionNotFulfilled"), "warning")
            newRow.optimisticEstimation = oldRow.optimisticEstimation
            newRow.modalEstimation = oldRow.modalEstimation
            newRow.pessimisticEstimation = oldRow.pessimisticEstimation
        } else {
            const task = taskMap.get(newRow.id)
            if (task) {
                let doUpdate: boolean = false
                if (task.optimisticEstimation !== newRow.optimisticEstimation) {
                    task.optimisticEstimation = newRow.optimisticEstimation
                    doUpdate = true
                }

                if (task.modalEstimation !== newRow.modalEstimation) {
                    task.modalEstimation = newRow.modalEstimation
                    doUpdate = true
                }

                if (task.pessimisticEstimation !== newRow.pessimisticEstimation) {
                    task.pessimisticEstimation = newRow.pessimisticEstimation
                    doUpdate = true
                }

                if (doUpdate) {
                    TaskAPI.update(task)
                        .then(response => {
                            if (!response.isSuccessful) {
                                showAlert(t("common.somethingWentWrong"), 'error')
                            }
                        })
                }
            }
        }

        console.log(newRow)

        return newRow
    }

    const steps: StepContent[] = [
        {
            label: t("pert.firstStepCalculation"),
            caption: t("pert.firstStepCalculationCaption"),
            content: (
                <PertFirstStepCalculation pertModel={pertModel}/>
            )
        },
        {
            label: t("pert.criticalPathCalculation"),
            caption: t("pert.criticalPathCalculationCaption"),
            content: (
                <PertCriticalPathCalculation pertModel={pertModel} projectId={projectId}/>
            )
        },
        {
            label: t("pert.finalStepCalculation"),
            caption: t("pert.finalStepCalculationCaption"),
            content: (
                <PertFinalStepCalculation pertModel={pertModel} projectId={projectId} />
            )
        },
    ];


    const columns: GridColDef<PertActivity>[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            renderCell: (params) => (
                <TaskIdLink projectId={projectId} taskId={params.row.id}/>
            ),
        },
        {
            field: '_name',
            headerName: t("task.name"),
            minWidth: 250,
            flex: 0.1,
            renderCell: (params) => (
                <Typography fontWeight='bold' color={params?.row?.isCritical ? red[800] : ''}>
                    {params.row.name}
                </Typography>
            ),
        },
        {
            field: 'optimisticEstimation',
            headerName: t("pert.optimisticEstimation"),
            type: "number",
            width: 150,
            editable: editable,
        },
        {
            field: 'modalEstimation',
            headerName: t("pert.modalEstimation"),
            type: "number",
            width: 170,
            editable: editable,
        },
        {
            field: 'pessimisticEstimation',
            headerName: t("pert.pessimisticEstimation"),
            type: "number",
            width: 170,
            editable: editable,
        },
        {
            field: 'averageDuration',
            headerName: t("pert.averageDuration"),
            type: "number",
            width: 170,
        },
        {
            field: 'standardDeviation',
            headerName: t("pert.standardDeviation"),
            type: "number",
            width: 170,
        },
        {
            field: 'dispersion',
            headerName: t("pert.dispersion"),
            type: "number",
            width: 130,
        },
    ]

    return (
        <Stack spacing={2}>
            <Accordion
                variant='outlined'
                sx={{mb: 0.5}}
                defaultExpanded
            >
                <AccordionSummary expandIcon={<KeyboardArrowDownIcon/>}>
                    <Stack direction='row' alignItems='center' spacing={0.5}>
                        <Typography variant='h6'>{t("pert.inputTableTitle")}</Typography>
                        <InfoIcon
                            titleComponent={
                                <Typography variant='caption'>{t("pert.inputTableTitleDescription")}</Typography>
                            }
                        />
                    </Stack>
                </AccordionSummary>

                <AccordionDetails>
                    <DataGrid
                        columns={columns}
                        rows={pertModel.activities}
                        processRowUpdate={processRowUpdate}
                        getRowId={row => row.id}
                        editMode='cell'
                        density='compact'
                        disableColumnFilter
                        disableColumnMenu
                        hideFooter
                        sx={{'& .MuiDataGrid-cell:focus-within': {outline: 'none'}}}
                    />
                </AccordionDetails>
            </Accordion>
            {pertModel.hasAllActivitiesFilledEstimations() && pertModel.isCpmCalculated() &&
                <CalculationPhaseStepper
                    steps={steps}
                    calculationTitle={t("pert.calculationTitle")}
                    calculationTitleDescription={t("pert.calculationTitleDescription")}
                />
            }


            <Box display='flex' justifyContent='center'>
                <Alert severity='error'>
                    {pertModel.isInitFailed &&
                        t("pert.calculationFailed")
                    }

                    {!pertModel.isInitFailed && !pertModel.hasAllActivitiesFilledEstimations() &&
                        t("pert.activitiesNotFilledTimeEstimate")
                    }

                    {!pertModel.isInitFailed && !pertModel.isCpmCalculated() &&
                        t("pert.cpmCalculationFailed")
                    }
                </Alert>
            </Box>


        </Stack>
    )
}

export default withSnackbar(PertPanel)