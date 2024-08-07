import React from "react";
import CalculationStepper from "../CalculationStepper";
import {PertModel} from "../../../methods/pert/PertModel";
import {PertActivity} from "../../../methods/pert/PertActivity";

interface PertFirstStepCalculationProps {
    pertModel: PertModel
}

const PertFirstStepCalculation: React.FC<PertFirstStepCalculationProps> = (props) => {
    const {
        pertModel,
    } = props

    type CalculationStepperHandler = React.ElementRef<typeof CalculationStepper>
    const calculationStepperRef = React.useRef<CalculationStepperHandler>(null)

    const buildAverageDurationEquations = (activity: PertActivity): string => {
        return `𝜇<sub>${activity.name}</sub> = (A<sub>${activity.name}</sub> + 4M<sub>${activity.name}</sub> + B<sub>${activity.name}</sub>) / 6 = 
                (${activity.optimisticEstimation} + 4${activity.modalEstimation} + ${activity.pessimisticEstimation}) / 6 = <strong>${activity.averageDuration?.toFixed(3)}</strong>`
    }

    const buildStandardDeviationEquations = (activity: PertActivity): string => {
        return `𝜎<sub>${activity.name}</sub> = (B<sub>${activity.name}</sub> - A<sub>${activity.name}</sub>) / 6 = 
                (${activity.pessimisticEstimation} - ${activity.optimisticEstimation}) / 6 = <strong>${activity.standardDeviation?.toFixed(3)}</strong>`
    }

    const buildDispersionEquations = (activity: PertActivity): string => {
        return `𝜎<sup>2</sup><sub>${activity.name}</sub> = 𝜎<sub>${activity.name}</sub> * 𝜎<sub>${activity.name}</sub> =
                ${activity.standardDeviation?.toFixed(3)} * ${activity.standardDeviation?.toFixed(3)} = <strong>${activity.dispersion?.toFixed(3)}</strong>`
    }

    return(
        <CalculationStepper
            ref={calculationStepperRef}
            calculationTitle='pert.firstStepCalculationStepContentTitle'
            calculationTitleInfo='pert.firstStepCalculationStepContentTitleDescription'
            calculations={[
                {
                    displayCalculation(activity: PertActivity): string {
                        return buildAverageDurationEquations(activity)
                    },
                    tooltip: "pert.averageDurationCalculation"
                },
                {
                    displayCalculation(activity: PertActivity): string {
                        return buildStandardDeviationEquations(activity)
                    },
                    tooltip: "pert.standardDeviationCalculation"
                },
                {
                    displayCalculation(activity: PertActivity): string {
                        return buildDispersionEquations(activity)
                    },
                    tooltip: "pert.dispersionCalculation"
                },
            ]}
            // customStepContent={customStepContent}
            activities={pertModel.activities}
        />
    )
}

export default PertFirstStepCalculation