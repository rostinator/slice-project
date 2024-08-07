import React from "react";
import {MpmModel} from "../../../methods/mpm/MpmModel";
import CalculationStepper from "../CalculationStepper";
import {useTranslation} from "react-i18next";
import {MpmActivity} from "../../../methods/mpm/MpmActivity";
import {Alert, AlertTitle, Box, Link, Stack, Typography} from "@mui/material";
import InfoIcon from "../../common/InfoIcon";
import {Trans} from "react-i18next";

interface MpmForwardCalculationProps {
    mpmModel: MpmModel;
}

const MpmForwardCalculation: React.FC<MpmForwardCalculationProps> = (props) => {
    const {
        mpmModel,
    } = props

    const {t} = useTranslation()

    type CalculationStepperHandler = React.ElementRef<typeof CalculationStepper>
    const calculationStepperRef = React.useRef<CalculationStepperHandler>(null)

    const activitiesMap = mpmModel.activitiesMap
    const activities = mpmModel.topologicalSort()

    const switchToStep = (activityId: number) => {
        calculationStepperRef?.current?.handleSetActiveStep(activities.findIndex(a => a.id === activityId))
    }

    const customStepContent = (activity: MpmActivity): React.ReactNode => {
        return (
            <>
                <Stack direction='row' alignItems='center' sx={{mb: 2}} spacing={0.5}>
                    <Typography variant='button'>{t("task.previousActivities")}:</Typography>
                    <InfoIcon
                        titleComponent={
                            <Typography variant='caption'>
                                <Trans i18nKey='mpm.previousActivitiesDescription' components={[<sub/>, <sup/>]}/>
                            </Typography>
                        }
                    />
                </Stack>
                {activity.predecessors.length > 0 ?
                    activity.predecessors.map(id => activitiesMap.get(id)).map(predecessor => (
                        predecessor &&
                        <Box key={predecessor.id} sx={{ml: 2}} display='flex'>
                            <Link
                                href={"#cpm-step-" + predecessor.id}
                                onClick={() => switchToStep(predecessor.id)}
                                variant='body2'
                                underline='none'
                            >
                                {'@' + predecessor.id}
                            </Link>
                            <Typography
                                variant='body2'
                                sx={{ml: 1}}
                            >
                                {predecessor.name}
                            </Typography>
                            <Typography
                                variant='body1'
                                sx={{ml: 0.5}}
                            >
                                {`(EF = ${predecessor.earliestFinish}, A = ${mpmModel.findActivitiesRelationship(predecessor.id, activity.id)?.minimumTimeGapOrDefaultValue})`}
                            </Typography>
                        </Box>
                    ))
                    :
                    <Typography sx={{ml: 2}} variant='body2'>{t("task.initialActivity")}</Typography>
                }
            </>
        )
    }

    const buildESEquations = (activity: MpmActivity): string => {
        if (activity.predecessors.length > 0) {
            return `ES<sub>${activity.name}</sub> = EF<sub>${activity.name}</sub> - T<sub>${activity.name}</sub> = ${activity.earliestFinish} - ${activity.duration} = <strong>${activity.earliestStart}</strong>`
        } else {
            return `ES<sub>${activity.name}</sub> = 0`
        }
    }

    const buildEFEquations = (activity: MpmActivity): string => {
        if (activity.predecessors.length > 0) {
            const predecessors = activity.predecessors.map(id => activitiesMap.get(id))
            return `EF<sub>${activity.name}</sub> = max(${predecessors.map(p => `EF<sub>${p?.name}</sub> 
                    + a<sub>${p?.name} - ${activity.name}</sub> + t<sub>${activity.name}</sub>`).join(", ")}) = 
                    max(${predecessors.map(p => `${p?.earliestFinish} + ${mpmModel.findActivitiesRelationship(p?.id, activity.id)?.minimumTimeGapOrDefaultValue} + ${activity.duration}`).join(", ")}) =
                    max(${predecessors.map(p => (p?.earliestFinish ?? 0) + (mpmModel.findActivitiesRelationship(p?.id, activity.id)?.minimumTimeGapOrDefaultValue ?? 0) + activity.duration).join(", ")}) = <strong>${activity.earliestFinish}</strong>`
        } else {
            return `EF<sub>${activity.name}</sub> = T<sub>${activity.name}</sub> = <strong>${activity.earliestFinish}</strong>`
        }
    }

    const buildCheckCondition = (activity: MpmActivity): string => {
        if (activity.predecessors.length > 0) {
            const predecessors = activity.predecessors.map(id => activitiesMap.get(id))
            let condition1 = predecessors.map(p => `ES<sub>${p?.name}</sub> - ES<sub>${activity.name}</sub> &le; b<sub>${p?.name}-${activity.name}</sub>`);
            let condition2 = predecessors.map(p => `<strong><span style="color: ${mpmModel.findActivitiesRelationship(p?.id, activity.id)?.isForwardConditionFulfilled ? '#34b401' : '#980000'}">${p?.earliestStart} - ${activity.earliestStart} &le; ${mpmModel.findActivitiesRelationship(p?.id, activity.id)?.maximumTimeGapOrDefaultValueStr}</span></strong>`);

            const conditionLine: string[] = []
            for (let i = 0; i < condition1.length; i++) {
                conditionLine.push(condition1[i] + " &rArr; " + condition2[i])
            }

            return conditionLine.join("<br>")
        } else {
            return t("mpm.forwardCalculationConditionSubstitute")
        }
    }

    return (
        <>
            {mpmModel.isForwardCalculationFailed &&
                <Alert severity='error' sx={{mb: 2}}>
                    <AlertTitle>{t("mpm.forwardCalculationFailed")}</AlertTitle>
                    <Typography sx={{mt: 2}}>{t("mpm.notFulfilledRelationships")}</Typography>
                    <ul>
                        {
                            mpmModel.activitiesRelationship.filter(r => r.isForwardConditionFulfilled === false).map((relationship) => (
                                <li>
                                    <Stack direction='row'>
                                        <Link
                                            href={"#cpm-step-" + relationship.relatedTaskId}
                                            onClick={() => switchToStep(relationship.relatedTaskId)}
                                            variant='body2'
                                            underline='none'
                                        >
                                            {'@' + relationship.relatedTaskId}
                                        </Link>
                                        <Typography
                                            variant='body2'
                                            sx={{ml: 1}}
                                        >
                                            {activitiesMap.get(relationship.relatedTaskId)?.name}
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
                calculationTitle='mpm.forwardCalculationTitle'
                calculationTitleInfo='mpm.forwardCalculationDescription'
                calculations={[
                    {
                        displayCalculation(activity: MpmActivity): string {
                            return buildEFEquations(activity)
                        },
                        tooltip: "mpm.forwardEFCalculation"
                    },
                    {
                        displayCalculation(activity: MpmActivity): string {
                            return buildESEquations(activity)
                        },
                        tooltip: "mpm.forwardESCalculation"
                    },
                ]}
                conditions={[
                    {
                        displayCalculation(activity: MpmActivity): string {
                            return buildCheckCondition(activity)
                        },
                        tooltip: "mpm.forwardCalculationCondition"
                    }
                ]}
                customStepContent={customStepContent}
                activities={activities}
            />
        </>
    )
}

export default MpmForwardCalculation