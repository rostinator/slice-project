import React from "react";
import {CpmModel} from "../../../methods/cpm/CpmModel";
import {Stack, Typography} from "@mui/material";
import {useTranslation, Trans} from "react-i18next";
import InfoIcon, {HtmlTooltip} from "../../common/InfoIcon";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import EastIcon from '@mui/icons-material/East';
import TaskIdLink from "../../task/TaskIdLink";
import {red} from "@mui/material/colors";

interface CpmCriticalPathCalculationProps {
    cpmModel: CpmModel,
    projectId: number,
}

const CpmCriticalPathCalculation: React.FC<CpmCriticalPathCalculationProps> = (props) => {
    const {
        cpmModel,
        projectId,
    } = props

    const {t} = useTranslation()

    const criticalActivities = cpmModel.topologicalSort().filter(a => a.isCritical)

    const buildTPEquations = (): string => {
        return `T<sub>P</sub> = ${criticalActivities.map(a => "t<sub>" + a.name + "</sub>").join(" + ")} = 
        ${criticalActivities.map(a => a.duration).join(" + ")} = <strong>${criticalActivities.map(a => a.duration).reduce((a, b) => a + b)}</strong>`
    }

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

                <Typography sx={{pt: 1}} variant='button'>{t("cpm.estimatedProjectDuration")}</Typography>

                <HtmlTooltip
                    title={
                        <Typography variant='caption'>
                            <Trans i18nKey='cpm.estimatedProjectDurationDescription' components={[<sub/>]}/>
                        </Typography>
                    }
                    placement="bottom-start"
                >
                    <Typography variant='overline' lineHeight={2} sx={{ml: 2}} fontSize={14}
                                dangerouslySetInnerHTML={{__html: buildTPEquations()}}/>
                </HtmlTooltip>

            </Stack>
        </Stack>
    )
}

export default CpmCriticalPathCalculation