import React, {useEffect, useState} from "react";
import {Task} from "../../../model/models";
import {Accordion, AccordionDetails, AccordionSummary, Alert, Box, Stack, Typography} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InfoIcon from "../../common/InfoIcon";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {Trans, useTranslation} from "react-i18next";
import {MpmModel} from "../../../methods/mpm/MpmModel";
import {MpmRelationship} from "../../../methods/mpm/MpmRelationship";
import TaskIdLink from "../../task/TaskIdLink";
import {grey, red} from "@mui/material/colors";
import {withSnackbar, WithSnackbarProps} from "../../common/feedback/Snackbar";
import {TaskAPI} from "../../../api/TaskAPI";
import CalculationPhaseStepper, {StepContent} from "../CalculationPhaseStepper";
import MpmForwardCalculation from "./MpmForwardCalculation";
import MpmBackwardCalculation from "./MpmBackwardCalculation";
import MpmReservesCalculation from "./MpmReservesCalculation";
import MpmCriticalPathCalculation from "./MpmCriticalPathCalculation";
import {CpmActivity} from "../../../methods/cpm/CpmActivity";
import {MpmActivity} from "../../../methods/mpm/MpmActivity";

interface MpmPanelProps extends WithSnackbarProps {
    tasks: Task[];
    editable: boolean;
    projectId: number;
}

const MpmPanel: React.FC<MpmPanelProps> = (props) => {
    const {
        tasks,
        editable,
        projectId,
        showAlert,
    } = props

    const {t} = useTranslation()

    const taskMap: Map<number, Task> = new Map(tasks.map(obj => [obj.id, obj]))
    const [mpmModel, setMpmModel] = useState<MpmModel>(new MpmModel(tasks))

    useEffect(() => {
        setMpmModel(new MpmModel(tasks))
    }, [tasks])

    const processRowUpdate = (newRow: MpmRelationship, oldRow: MpmRelationship): MpmRelationship => {
        console.log('new', newRow)
        console.log('old', oldRow)

        if (newRow.maximumTimeGap !== undefined && newRow.minimumTimeGap !== undefined) {
            if (newRow.minimumTimeGap > Math.abs(newRow.maximumTimeGap)) {
                showAlert(t("mpm.timeGapConditionNotFulfilled"), 'warning')
                newRow.minimumTimeGap = oldRow.minimumTimeGap
                newRow.maximumTimeGap = oldRow.maximumTimeGap
            }
        }

        if (newRow.minimumTimeGap !== oldRow.minimumTimeGap || newRow.maximumTimeGap !== oldRow.maximumTimeGap) {
            TaskAPI.updateRelationship(newRow.relatedTaskId, newRow.taskId, newRow.minimumTimeGap, newRow.maximumTimeGap)
                .then(response => {
                    if (!response.isSuccessful)
                        showAlert(t("common.somethingWentWrong"), 'error')
                })
        }

        return newRow
    }

    const relationshipColumns: GridColDef<MpmRelationship>[] = [
        {
            field: 'id',
            headerName: t("task.activity"),
            minWidth: 250,
            flex: 0.2,
            renderCell: (params) => (
                <Stack direction='row' alignItems='center' spacing={1}>
                    <TaskIdLink projectId={projectId} taskId={params.row.taskId}/>
                    <Typography variant='body2'>{taskMap.get(params.row.taskId)?.name}</Typography>
                </Stack>
            ),
        },
        {
            field: 'id2',
            headerName: t("task.followingActivity"),
            minWidth: 250,
            flex: 0.8,
            renderCell: (params) => (
                <Stack direction='row' alignItems='center' spacing={1}>
                    <TaskIdLink projectId={projectId} taskId={params.row.relatedTaskId}/>
                    <Typography variant='body2'>{taskMap.get(params.row.relatedTaskId)?.name}</Typography>
                </Stack>
            ),
        },
        {
            field: 'minimumTimeGap',
            headerName: t("mpm.minimumTimeGap"),
            width: 250,
            type: 'number',
            editable: editable,
            renderCell: (params) => (
                <Typography
                    variant='body2'
                    style={{color: params.row.minimumTimeGap ? grey[900] : grey[500]}}
                >
                    {params.row.minimumTimeGap ? params.row.minimumTimeGap : '0'}
                </Typography>
            ),
        },
        {
            field: 'maximumTimeGap',
            headerName: t("mpm.maximumTimeGap"),
            width: 250,
            type: 'number',
            editable: editable,
            renderCell: (params) => (
                params.row.maximumTimeGap !== undefined ?
                    <Typography
                        variant='body2'
                        style={{color: grey[900]}}
                    >
                        {params.row.maximumTimeGap}
                    </Typography>
                    :
                    <Typography
                        variant='body2'
                        fontSize={20}
                        style={{color: grey[500]}}
                        dangerouslySetInnerHTML={{__html: '- &infin;'}}
                    />
            ),
        },
    ]

    const steps: StepContent[] = [
        {
            label: t("mpm.forwardCalculation"),
            caption: t("mpm.forwardCalculationCaption"),
            content: (
                <MpmForwardCalculation mpmModel={mpmModel}/>
            )
        },
        {
            label: t("mpm.backwardCalculation"),
            caption: t("mpm.backwardCalculationCaption"),
            content: (
                <MpmBackwardCalculation mpmModel={mpmModel}/>
            )
        },
        {
            label: t("mpm.timeReservesCalculation"),
            caption: t("mpm.timeReservesCalculationCaption"),
            content: (
                <MpmReservesCalculation mpmModel={mpmModel}/>
            )
        },
        {
            label: t("mpm.criticalPathDetermining"),
            caption: t("mpm.criticalPathDeterminingCaption"),
            content: (
                <MpmCriticalPathCalculation mpmModel={mpmModel} projectId={projectId}/>
            )
        },
    ]

    const columns: GridColDef<MpmActivity>[] = [
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
    ];

    return (
        <Stack spacing={2}>
            <Accordion
                variant='outlined'
                sx={{mb: 0.5}}
                defaultExpanded
            >
                <AccordionSummary expandIcon={<KeyboardArrowDownIcon/>}>
                    <Stack direction='row' alignItems='center' spacing={0.5}>
                        <Typography variant='h6'>{t("mpm.inputTableTitle")}</Typography>
                        <InfoIcon
                            titleComponent={
                                <Typography variant='caption'>
                                    <Trans i18nKey='mpm.inputTableTitleDescription' components={[<i/>]}/>
                                </Typography>
                            }
                        />
                    </Stack>
                </AccordionSummary>

                <AccordionDetails>
                    <DataGrid
                        columns={relationshipColumns}
                        rows={mpmModel.activitiesRelationship}
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

            {mpmModel.isInitFailed ?
                <Box display='flex' justifyContent='center'>
                    <Alert severity="error">{t("cpm.calculationFailed")}</Alert>
                </Box>
                :
                <CalculationPhaseStepper
                    steps={steps}
                    calculationTitle={t("mpm.calculationTitle")}
                    calculationTitleDescription={t("mpm.calculationTitleDescription")}
                />
            }

            <Accordion
                variant='outlined'
                sx={{mb: 0.5}}
                defaultExpanded
            >
                <AccordionSummary expandIcon={<KeyboardArrowDownIcon/>}>
                    <Stack direction='row' alignItems='center' spacing={0.5}>
                        <Typography variant='h6'>{t("mpm.calculationTableTitle")}</Typography>
                        <InfoIcon
                            titleComponent={
                                <Typography variant='caption'>
                                    <Trans i18nKey='mpm.calculationTableTitleDescription' components={[<i/>]}/>
                                </Typography>
                            }
                        />
                    </Stack>
                </AccordionSummary>

                <AccordionDetails>
                    <DataGrid
                        columns={columns}
                        rows={mpmModel.activities}
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

        </Stack>
    )
}

export default withSnackbar(MpmPanel)