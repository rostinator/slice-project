import React from "react";
import {MpmModel} from "../../../methods/mpm/MpmModel";
import {Alert, AlertTitle, Box, Link, Stack, Typography} from "@mui/material";
import {Trans, useTranslation} from "react-i18next";
import CalculationStepper from "../CalculationStepper";
import {MpmActivity} from "../../../methods/mpm/MpmActivity";
import InfoIcon from "../../common/InfoIcon";

interface MpmBackwardCalculationProps {
    mpmModel: MpmModel;
}

const MpmBackwardCalculation: React.FC<MpmBackwardCalculationProps> = (props) => {
    const {
        mpmModel,
    } = props

    const {t} = useTranslation()

    type CalculationStepperHandler = React.ElementRef<typeof CalculationStepper>
    const calculationStepperRef = React.useRef<CalculationStepperHandler>(null)

    const activitiesMap = mpmModel.activitiesMap
    const activities = mpmModel.topologicalSort(true)

    const switchToStep = (activityId: number) => {
        calculationStepperRef?.current?.handleSetActiveStep(activities.findIndex(a => a.id === activityId))
    }

    const customStepContent = (activity: MpmActivity): React.ReactNode => {
        return (
            <>
                <Stack direction='row' alignItems='center' sx={{mb: 2}} spacing={0.5}>
                    <Typography variant='button'>{t("task.followingActivities")}:</Typography>
                    <InfoIcon
                        titleComponent={
                            <Typography variant='caption'>
                                <Trans i18nKey='mpm.followingActivitiesDescription' components={[<sub/>, <sup/>]}/>
                            </Typography>
                        }
                    />
                </Stack>
                {activity.successors.length > 0 ?
                    activity.successors.map(id => activitiesMap.get(id)).map(successor => (
                        successor &&
                        <Box key={successor.id} sx={{ml: 2}} display='flex'>
                            <Link
                                href={"#cpm-step-" + successor.id}
                                onClick={() => switchToStep(successor.id)}
                                variant='body2'
                                underline='none'
                            >
                                {'@' + successor.id}
                            </Link>
                            <Typography
                                variant='body2'
                                sx={{ml: 1}}
                            >
                                {successor.name}
                            </Typography>
                            <Typography
                                variant='body1'
                                sx={{ml: 0.5}}
                            >
                                {`(LS = ${successor.latestStart}, A = ${mpmModel.findActivitiesRelationship(activity.id, successor.id)?.minimumTimeGapOrDefaultValue})`}
                            </Typography>
                        </Box>
                    ))
                    :
                    <Typography sx={{ml: 2}} variant='body2'>{t("task.endActivity")}</Typography>
                }
            </>
        )
    }

    const buildLSEquations = (activity: MpmActivity): string => {
        if (activity.successors.length > 0) {
            const successors = activity.successors.map(id => activitiesMap.get(id))
            return `LS<sub>${activity.name}</sub> = min(${successors.map(p => `LS<sub>${p?.name}</sub> 
                    - a<sub>${p?.name} - ${activity.name}</sub> - t<sub>${activity.name}</sub>`).join(", ")}) = 
                    min(${successors.map(p => `${p?.latestStart} - ${mpmModel.findActivitiesRelationship(activity.id, p?.id)?.minimumTimeGapOrDefaultValue} - ${activity.duration}`).join(", ")}) =
                    min(${successors.map(p => (p?.latestStart ?? 0) - (mpmModel.findActivitiesRelationship(activity.id, p?.id)?.minimumTimeGapOrDefaultValue ?? 0) - activity.duration).join(", ")}) = <strong>${activity.latestStart}</strong>`
        } else {
            return `LS<sub>${activity.name}</sub> = LF<sub>${activity.name}</sub> - t<sub>${activity.name}</sub> = ${activity.latestFinish} - ${activity.duration} = <strong>${activity.latestStart}</strong> `
        }
    }

    const buildLFEquations = (activity: MpmActivity): string => {
        if (activity.successors.length > 0) {
            return `LF<sub>${activity.name}</sub> = LS<sub>${activity.name}</sub> + t<sub>${activity.name}</sub> = ${activity.latestStart} + ${activity.duration} = <strong>${activity.latestFinish}</strong>`
        } else {
            return `LF<sub>${activity.name}</sub> = <strong>${activity.latestFinish}</strong>`
        }
    }

    const buildCheckCondition = (activity: MpmActivity): string => {
        if (activity.successors.length > 0) {
            const successors = activity.successors.map(id => activitiesMap.get(id))
            let condition1 = successors.map(p => `LS<sub>${p?.name}</sub> - LF<sub>${activity.name}</sub> &le; b<sub>${p?.name}-${activity.name}</sub>`);
            let condition2 = successors.map(p => `<strong><span style="color: ${mpmModel.findActivitiesRelationship(activity.id, p?.id)?.isBackwardConditionFulfilled ? '#34b401' : '#980000'}">${p?.latestStart} - ${activity.latestFinish} &le; ${mpmModel.findActivitiesRelationship(activity.id, p?.id)?.maximumTimeGapOrDefaultValueStr}</span></strong>`);

            const conditionLine: string[] = []
            for (let i = 0; i < condition1.length; i++) {
                conditionLine.push(condition1[i] + " &rArr; " + condition2[i])
            }

            return conditionLine.join("<br>")
        } else {
            return t("mpm.backwardCalculationConditionSubstitute")
        }
    }

    return (
        <>
            {mpmModel.isForwardCalculationFailed &&
                <Alert severity='error'>
                    {t("mpm.forwardCalculationFailed")}
                </Alert>
            }
            {mpmModel.isBackwardCalculationFailed &&
                <Alert severity='error' sx={{mb: 2}}>
                    <AlertTitle>{t("mpm.backwardCalculationFailed")}</AlertTitle>
                    <Typography sx={{mt: 2}}>{t("mpm.notFulfilledRelationships")}</Typography>
                    <ul>
                        {
                            mpmModel.activitiesRelationship.filter(r => r.isBackwardConditionFulfilled === false).map((relationship) => (
                                <li>
                                    <Stack direction='row'>
                                        <Link
                                            href={"#cpm-step-" + relationship.taskId}
                                            onClick={() => switchToStep(relationship.taskId)}
                                            variant='body2'
                                            underline='none'
                                        >
                                            {'@' + relationship.taskId}
                                        </Link>
                                        <Typography
                                            variant='body2'
                                            sx={{ml: 1}}
                                        >
                                            {activitiesMap.get(relationship.taskId)?.name}
                                        </Typography>
                                    </Stack>
                                </li>
                            ))
                        }
                    </ul>
                </Alert>
            }

            <CalculationStepper
                ref={calculationStepperRef}
                calculationTitle='mpm.backwardCalculationTitle'
                calculationTitleInfo='mpm.backwardCalculationTitleDescription'
                calculations={[
                    {
                        displayCalculation(activity: MpmActivity): string {
                            return buildLSEquations(activity)
                        },
                        tooltip: "mpm.backwardLSCalculation"
                    },
                    {
                        displayCalculation(activity: MpmActivity): string {
                            return buildLFEquations(activity)
                        },
                        tooltip: "mpm.backwardLFCalculation"
                    },
                ]}
                conditions={[
                    {
                        displayCalculation(activity: MpmActivity): string {
                            return buildCheckCondition(activity)
                        },
                        tooltip: "mpm.backwardCalculationCondition"
                    }
                ]}
                customStepContent={customStepContent}
                activities={activities}
            />
        </>
    )
}

export default MpmBackwardCalculation