import React from "react";
import {MpmModel} from "../../../methods/mpm/MpmModel";
import {Alert} from "@mui/material";
import {useTranslation} from "react-i18next";
import {MpmActivity} from "../../../methods/mpm/MpmActivity";
import CalculationStepper from "../CalculationStepper";

interface MpmReservesCalculationProps {
    mpmModel: MpmModel;
}

const MpmReservesCalculation: React.FC<MpmReservesCalculationProps> = (props) => {
    const {
        mpmModel,
    } = props

    const {t} = useTranslation()

    const activities = mpmModel.topologicalSort()

    const buildRCEquations = (activity: MpmActivity): string => {
        return `TS<sub>${activity.name}</sub> = LF<sub>${activity.name}</sub> - ES<sub>${activity.name}</sub> - t<sub>${activity.name}</sub> =
                ${activity.latestFinish} - ${activity.earliestStart} - ${activity.duration} = <strong>${activity.totalFloat}</strong>`
    }

    return (
        <>
            {mpmModel.isBackwardCalculationFailed &&
                <Alert severity='error'>
                    {t("mpm.backwardCalculationFailed")}
                </Alert>
            }

            <CalculationStepper
                calculationTitle='mpm.reservesCalculationTitle'
                calculationTitleInfo='mpm.reservesCalculationTitleDescription'
                calculations={[
                    {
                        displayCalculation(activity: MpmActivity): string {
                            return buildRCEquations(activity)
                        },
                        tooltip: "cpm.floatTSCalculation"
                    },
                ]}
                activities={activities}
            />
        </>
    )
}

export default MpmReservesCalculation