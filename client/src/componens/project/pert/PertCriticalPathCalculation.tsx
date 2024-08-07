import React from "react";
import {PertModel} from "../../../methods/pert/PertModel";
import {Alert, Box, Stack, Typography} from "@mui/material";
import InfoIcon from "../../common/InfoIcon";
import {useTranslation, Trans} from "react-i18next";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import EastIcon from "@mui/icons-material/East";
import TaskIdLink from "../../task/TaskIdLink";
import {red} from "@mui/material/colors";

interface PertCriticalPathCalculationProps {
    pertModel: PertModel;
    projectId: number;
}

const PertCriticalPathCalculation: React.FC<PertCriticalPathCalculationProps> = (props) => {
    const {
        pertModel,
        projectId,
    } = props

    const {t} = useTranslation()

    const cpmModel = pertModel.cpmModel;
    const criticalActivities = cpmModel ? cpmModel.topologicalSort().filter(a => a.isCritical) : []

    return (
        <Stack spacing={2}>
            <Stack direction='row' alignItems='center' spacing={0.5}>
                <Typography variant='h6'>{t("pert.cpmCalculationTitle")}</Typography>
                <InfoIcon
                    titleComponent={
                        <Typography variant='caption'>
                            <Trans i18nKey='pert.cpmCalculationTitleDescription' components={[<sub/>]}/>
                        </Typography>
                    }
                />
            </Stack>

            {
                pertModel.isCpmCalculated() ?
                    <Stack pl={2} spacing={1}>
                        <Stack direction='row' alignItems='center' spacing={0.5}>
                            <Typography variant='button'>{t("cpm.criticalActivities")}</Typography>
                            <InfoIcon
                                titleComponent={<Typography
                                    variant='caption'>{t("cpm.criticalActivitiesDescription")}</Typography>}
                            />
                        </Stack>
                        <Breadcrumbs
                            separator={<EastIcon/>}
                            maxItems={50}
                        >
                            {criticalActivities.map((value, index) => (
                                <Stack direction='row' spacing={1} key={index}>
                                    <TaskIdLink taskId={value.id} projectId={projectId}/>
                                    <Typography fontWeight='bold' color={red[800]}>{value.name}</Typography>
                                </Stack>
                            ))}
                        </Breadcrumbs>
                    </Stack>
                    :
                    <Box display='flex' justifyContent='center'>
                        <Alert severity='error'>
                            {t("pert.activitiesNotFilledTimeEstimate")}
                        </Alert>
                    </Box>
            }
        </Stack>
    )
}

export default PertCriticalPathCalculation