import React from "react";
import {Box, Link, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {CpmModel} from "../../../methods/cpm/CpmModel";
import {CpmActivity} from "../../../methods/cpm/CpmActivity";
import CalculationStepper from "../CalculationStepper";

interface CpmCalculationProps {
    cpmModel: CpmModel;
}

const CpmForwardCalculation: React.FC<CpmCalculationProps> = (props) => {
    const {
        cpmModel,
    } = props

    type CalculationStepperHandler = React.ElementRef<typeof CalculationStepper>
    const calculationStepperRef = React.useRef<CalculationStepperHandler>(null)

    const {t} = useTranslation()

    const activitiesMap = cpmModel.activitiesMap()
    const activities = cpmModel.topologicalSort()

    const switchToStep = (activityId: number) => {
        calculationStepperRef?.current?.handleSetActiveStep(activities.findIndex(a => a.id === activityId))
    }

    const customStepContent = (activity: CpmActivity): React.ReactNode => {
        return (
            <>
                <Typography variant='button'>{t("task.previousActivities")}:</Typography>
                {activity.predecessors.length > 0 ?
                    activity.predecessors.map(id => activitiesMap.get(id)).map(predecessor => (
                        predecessor &&
                        <Box key={predecessor.id} sx={{ml: 2}} display='flex'>
                            <Link
                                href={"#cpm-step-" + predecessor.id}
                                onClick={() => switchToStep(predecessor.id)}
                                variant='body1'
                                underline='none'
                            >
                                {'@' + predecessor.id}
                            </Link>
                            <Typography
                                variant='body1'
                                sx={{ml: 1}}
                            >
                                {predecessor.name}
                            </Typography>
                        </Box>
                    ))
                    :
                    <Typography sx={{ml: 2}}>-</Typography>
                }
            </>
        )
    }

    const buildESEquations = (activity: CpmActivity): string => {
        if (activity.predecessors.length > 0) {
            const predecessors = activity.predecessors.map(id => activitiesMap.get(id))
            return `ES<sub>${activity.name}</sub> = MAX(${predecessors.map(p => `EF<sub>${p?.name}</sub>`).join(", ")})
             = MAX(${predecessors.map(p => p?.earliestFinish).join(", ")}) = <strong>${activity.earliestStart}</strong>`
        } else {
            return `ES<sub>${activity.name}</sub> = 0`
        }
    }
    const buildEFEquations = (activity: CpmActivity): string => {
        return `EF<sub>${activity.name}</sub> = t<sub>${activity.name}</sub> + ES<sub>${activity.name}</sub> = ${activity.duration} + ${activity.earliestStart} = <strong>${activity.earliestFinish}</strong>`;
    }

    return (
        <CalculationStepper
            ref={calculationStepperRef}
            calculationTitle='cpm.forwardCalculationTitle'
            calculationTitleInfo='cpm.forwardCalculationDescription'
            calculations={[
                {
                    displayCalculation(activity: CpmActivity): string {
                        return buildESEquations(activity)
                    },
                    tooltip: "cpm.forwardESCalculation"
                },
                {
                    displayCalculation(activity: CpmActivity): string {
                        return buildEFEquations(activity)
                    },
                    tooltip: "cpm.forwardEFCalculation"
                },
            ]}
            customStepContent={customStepContent}
            activities={activities}
        />
    )
}

export default CpmForwardCalculation