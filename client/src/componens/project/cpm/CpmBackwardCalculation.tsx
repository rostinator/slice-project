import React from "react";
import {CpmModel} from "../../../methods/cpm/CpmModel";
import CalculationStepper from "../CalculationStepper";
import {Box, Link, Typography} from "@mui/material";
import {CpmActivity} from "../../../methods/cpm/CpmActivity";
import {useTranslation} from "react-i18next";

interface CpmBackwardCalculation {
    cpmModel: CpmModel;
}

const CpmBackwardCalculation: React.FC<CpmBackwardCalculation> = (props) => {
    const {
        cpmModel
    } = props

    type CalculationStepperHandler = React.ElementRef<typeof CalculationStepper>
    const calculationStepperRef = React.useRef<CalculationStepperHandler>(null)

    const {t} = useTranslation()

    const activitiesMap = cpmModel.activitiesMap()
    const activities = cpmModel.topologicalSort(true)

    const switchToStep = (activityId: number) => {
        calculationStepperRef?.current?.handleSetActiveStep(activities.findIndex(a => a.id === activityId))
    }

    const customStepContent = (activity: CpmActivity): React.ReactNode => {
        return (
            <>
                <Typography variant='button'>{t("task.followingActivities")}:</Typography>
                {activity.successors.length > 0 ?
                    activity.successors.map(id => activitiesMap.get(id)).map(successor => (
                        successor &&
                        <Box key={successor.id} sx={{ml: 2}} display='flex'>
                            <Link
                                href={"#cpm-step-" + successor.id}
                                onClick={() => switchToStep(successor.id)}
                                variant='body1'
                                underline='none'
                            >
                                {'@' + successor.id}
                            </Link>
                            <Typography
                                variant='body1'
                                sx={{ml: 1}}
                            >
                                {successor.name}
                            </Typography>
                        </Box>
                    ))
                    :
                    <Typography sx={{ml: 2}}>-</Typography>
                }
            </>
        )
    }

    const buildLFEquations = (activity: CpmActivity): string => {
        if (activity.successors.length > 0) {
            const successors = activity.successors.map(id => activitiesMap.get(id))
            return `LF<sub>${activity.name}</sub> = MIN(${successors.map(p => `LS<sub>${p?.name}</sub>`).join(", ")})
             = MIN(${successors.map(p => p?.latestStart).join(", ")}) = <strong>${activity.latestFinish}</strong>`
        } else {
            return `LF<sub>${activity.name}</sub> = EF<sub>${activity.name}</sub> = <strong>${activity.latestFinish}</strong>`
        }
    }

    const buildLSEquations = (activity: CpmActivity): string => {
        return `LS<sub>${activity.name}</sub> = LF<sub>${activity.name}</sub> - t<sub>${activity.name}</sub> = ${activity.latestFinish} - ${activity.duration} = <strong>${activity.latestStart}</strong>`;
    }

    return (
        <CalculationStepper
            ref={calculationStepperRef}
            calculationTitle='cpm.backwardCalculationTitle'
            calculationTitleInfo='cpm.backwardCalculationDescription'
            calculations={[
                {
                    displayCalculation(activity: CpmActivity): string {
                        return buildLFEquations(activity)
                    },
                    tooltip: "cpm.forwardLFCalculation"
                },
                {
                    displayCalculation(activity: CpmActivity): string {
                        return buildLSEquations(activity)
                    },
                    tooltip: "cpm.forwardLSCalculation"
                },
            ]}
            customStepContent={customStepContent}
            activities={activities}
        />
    )
}

export default CpmBackwardCalculation