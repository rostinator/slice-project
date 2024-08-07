import React from "react";
import {MpmModel} from "../../../methods/mpm/MpmModel";
import {Stack, Typography} from "@mui/material";
import InfoIcon from "../../common/InfoIcon";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import EastIcon from "@mui/icons-material/East";
import TaskIdLink from "../../task/TaskIdLink";
import {red} from "@mui/material/colors";
import {useTranslation} from "react-i18next";

interface MpmCriticalPathCalculationProps {
    mpmModel: MpmModel;
    projectId: number;
}

const MpmCriticalPathCalculation: React.FC<MpmCriticalPathCalculationProps> = (props) => {
    const {
        mpmModel,
        projectId,
    } = props

    const {t} = useTranslation()

    const criticalActivities = mpmModel.topologicalSort().filter(a => a.isCritical)

    return (
        <Stack spacing={2}>
            <Stack direction='row' alignItems='center' spacing={0.5}>
                <Typography variant='h6'>{t("cpm.criticalPathTitle")}</Typography>
                <InfoIcon
                    titleComponent={<Typography variant='caption'>{t("cpm.criticalPathDescription")}</Typography>}
                />
            </Stack>
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
        </Stack>
    )
}

export default MpmCriticalPathCalculation