import React from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Alert,
    Box,
    Stack,
    Typography
} from "@mui/material";
import {Task} from "../../../model/models";
import {CpmModel} from "../../../methods/cpm/CpmModel";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {CpmActivity} from "../../../methods/cpm/CpmActivity";
import {useTranslation} from "react-i18next";
import {red} from "@mui/material/colors";
import TaskIdLink from "../../task/TaskIdLink";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CpmForwardCalculation from "./CpmForwardCalculation";
import InfoIcon from "../../common/InfoIcon";
import CpmBackwardCalculation from "./CpmBackwardCalculation";
import CpmFloatCalculation from "./CpmFloatCalculation";
import CpmCriticalPathCalculation from "./CpmCriticalPathCalculation";
import CalculationPhaseStepper, {StepContent} from "../CalculationPhaseStepper";

interface CpmPanelProps {
    tasks: Task[]
    projectId: number,
}

const CpmPanel: React.FC<CpmPanelProps> = (props) => {
    const {
        tasks,
        projectId,
    } = props

    const {t} = useTranslation()

    const cpmModel = CpmModel.initFromTask(tasks)

    const steps: StepContent[] = [
        {
            label: t("cpm.forwardCalculation"),
            caption: t("cpm.forwardCalculationCaption"),
            content: (
                <CpmForwardCalculation cpmModel={cpmModel}/>
            )
        },
        {
            label: t("cpm.backwardCalculation"),
            caption: t("cpm.backwardCalculationCaption"),
            content: (
                <CpmBackwardCalculation cpmModel={cpmModel}/>
            )
        },
        {
            label: t("cpm.timeReservesCalculation"),
            caption: t("cpm.timeReservesCalculationCaption"),
            content: (
                <CpmFloatCalculation cpmModel={cpmModel}/>
            )
        },
        {
            label: t("cpm.criticalPathDetermining"),
            caption: t("cpm.criticalPathDeterminingCaption"),
            content: (
                <CpmCriticalPathCalculation cpmModel={cpmModel} projectId={projectId}/>
            )
        },
    ];

    const columns: GridColDef<CpmActivity>[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 70,
            renderCell: (params) => (
                <TaskIdLink projectId={projectId} taskId={params.row.id}/>
            ),
        },
        {
            field: 'name',
            headerName: t("common.name"),
            minWidth: 250,
            flex: 0.1,
            renderCell: (params) => (
                <Typography fontWeight='bold' color={params.row.isCritical ? red[800] : ''}>
                    {params.row.name}
                </Typography>
            ),
        },
        {
            field: 'duration',
            headerName: t("task.duration"),
            width: 100,
        },
        {
            field: 'earliestStart',
            headerName: 'ES',
            width: 100,
            description: t("cpm.earliestStart"),
            disableColumnMenu: true
        },
        {
            field: 'earliestFinish',
            headerName: 'EF',
            width: 100,
            description: t("cpm.earliestFinish"),
        },
        {
            field: 'latestStart',
            headerName: 'LS',
            width: 100,
            description: t("cpm.latestStart"),
        },
        {
            field: 'latestFinish',
            headerName: 'LF',
            width: 100,
            description: t("cpm.latestFinish"),
        },
        {
            field: 'totalFloat',
            headerName: 'TF',
            width: 100,
            description: t("cpm.totalFloat"),

        },
        {
            field: 'freeFloat',
            headerName: 'FF',
            width: 100,
            description: t("cpm.freeFloat"),
        },
    ];

    return (
        cpmModel.isCalculationFailed ?
            <Box display='flex' justifyContent='center'>
                <Alert severity="error">{t("cpm.calculationFailed")}</Alert>
            </Box>
            :
            <Stack spacing={2}>
                <CalculationPhaseStepper
                    steps={steps}
                    calculationTitle={t("cpm.cpmCalculationTitle")}
                    calculationTitleDescription={t("cpm.calculationProcedureDescription")}
                />

                <Accordion
                    variant='outlined'
                    sx={{mb: 0.5}}
                    defaultExpanded
                >
                    <AccordionSummary expandIcon={<KeyboardArrowDownIcon/>}>
                        <Stack direction='row' alignItems='center' spacing={0.5}>
                            <Typography variant='h6'>{t("cpm.cpmTableTitle")}</Typography>
                            <InfoIcon
                                titleComponent={
                                    <Typography variant='caption'>{t("cpm.resultsTableDescription")}</Typography>
                                }
                            />
                        </Stack>
                    </AccordionSummary>

                    <AccordionDetails>
                        <DataGrid
                            columns={columns}
                            rows={cpmModel.activities}
                            editMode='cell'
                            density='compact'
                            getRowId={(row) => row.id}
                            disableColumnFilter
                            disableColumnMenu
                            hideFooter
                            sx={{'& .MuiDataGrid-cell:focus-within': {outline: 'none'}}}
                        />
                    </AccordionDetails>
                </Accordion>
            </Stack>
    )
}

export default CpmPanel