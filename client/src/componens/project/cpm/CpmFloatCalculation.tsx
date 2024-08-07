import React from "react";
import CalculationStepper from "../CalculationStepper";
import {CpmActivity} from "../../../methods/cpm/CpmActivity";
import {CpmModel} from "../../../methods/cpm/CpmModel";
import {Box, Link, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";

interface CpmFloatCalculationProps {
    cpmModel: CpmModel;
}

const CpmFloatCalculation: React.FC<CpmFloatCalculationProps> = (props) => {
    const {
        cpmModel,
    } = props

    type CalculationStepperHandler = React.ElementRef<typeof CalculationStepper>
    const calculationStepperRef = React.useRef<CalculationStepperHandler>(null)

    const {t} = useTranslation()

    const activities = cpmModel.topologicalSort()
    const activitiesMap = cpmModel.activitiesMap()

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

    const buildTSEquations = (activity: CpmActivity): string => {
        return `TS<sub>${activity.name}</sub> = LS<sub>${activity.name}</sub> - ES<sub>${activity.name}</sub> = ${activity.latestStart} - ${activity.earliestStart} = <strong>${activity.totalFloat}</strong>`;
    }

    const buildFSEquations = (activity: CpmActivity): string => {
        const successors = activity.successors.map(id => activitiesMap.get(id))
        return `FS<sub>${activity.name}</sub> = MIN(${successors.map(s => "ES<sub>"+s?.name+"</sub>").join(', ')}) - EF<sub>${activity.name}</sub> = MIN(${successors.map(s => s?.earliestStart).join(', ')}) - ${activity.earliestFinish} = <strong>${activity.freeFloat}</strong>`;
    }

    return(
        <CalculationStepper
            ref={calculationStepperRef}
            calculationTitle='cpm.floatCalculationTitle'
            calculationTitleInfo='cpm.floatCalculationDescription'
            calculations={[
                {
                    displayCalculation(activity: CpmActivity): string {
                        return buildTSEquations(activity)
                    },
                    tooltip: "cpm.floatTSCalculation"
                },
                {
                    displayCalculation(activity: CpmActivity): string {
                        return buildFSEquations(activity)
                    },
                    tooltip: "cpm.floatFSCalculation"
                },
            ]}
            customStepContent={customStepContent}
            activities={activities}
        />
    )
}

export default CpmFloatCalculation
