import React from "react";
import {Trans, useTranslation} from "react-i18next";
import {
    Alert,
    Box,
    Divider,
    IconButton,
    Stack,
    Step,
    StepButton,
    StepContent,
    StepLabel,
    Stepper,
    Typography
} from "@mui/material";
import InfoIcon, {HtmlTooltip} from "../common/InfoIcon";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

export interface Activity {
    id: number;
    name: string;
    calculationFailed: boolean;
}

interface CalculationData {
    tooltip: string;

    displayCalculation(activity: Activity): string
}

interface CalculationStepperProps {
    calculationTitle: string;
    calculationTitleInfo: string;
    conditionTitleInfo?: string;
    activities: Activity[];

    customStepContent?(activity: Activity): React.ReactNode;

    calculations: CalculationData[];
    conditions?: CalculationData[];
}

export type CalculationStepperHandle = {
    handleSetActiveStep: (activeStepIndex: number) => void;
}

const CalculationStepper: React.ForwardRefRenderFunction<CalculationStepperHandle, CalculationStepperProps> = (props, forwardedRef) => {

    const {
        calculationTitle,
        calculationTitleInfo,
        conditionTitleInfo,
        activities,
        customStepContent,
        calculations,
        conditions,
    } = props

    const {t} = useTranslation()

    const [activeStep, setActiveStep] = React.useState(0);

    React.useImperativeHandle(forwardedRef, () => ({
        handleSetActiveStep(activeStepIndex: number) {
            setActiveStep(activeStepIndex)
        }
    }))

    const handleStep = (step: number) => {
        setActiveStep(step);
    };

    return (
        <Stack>
            <Stack direction='row' alignItems='center' spacing={0.5}>
                <Typography variant='h6'>{t(calculationTitle)}</Typography>
                <InfoIcon titleComponent={
                    <Typography variant='caption'>
                        <Trans i18nKey={calculationTitleInfo} components={[<sub/>]}/>
                    </Typography>
                }/>
            </Stack>
            <Stepper nonLinear activeStep={activeStep} orientation="vertical" sx={{mx: 1}}>
                {activities.map((activity, index) => (
                    <Step key={activity.id} id={'cpm-step-' + activity.id} sx={{scrollMarginTop: 500}}>
                        <StepButton onClick={() => handleStep(index)}>
                            {activity.name}
                        </StepButton>
                        {
                            activity.calculationFailed &&
                            <StepLabel error={true}>
                            </StepLabel>
                        }
                        <StepContent>
                            {
                                activity.calculationFailed ?
                                    <Alert severity='error'>
                                        {t("project.calculationFailed")}
                                    </Alert>
                                    :
                                    <Stack mt={1} mb={3} spacing={1}>
                                        <Divider/>
                                        <Stack>
                                            {customStepContent && customStepContent(activity)}
                                            <Typography
                                                variant='button'
                                                sx={{my: 2}}
                                            >
                                                {t("common.calculation")}:
                                            </Typography>

                                            {calculations.map((calculation, index) => (
                                                <HtmlTooltip
                                                    key={index}
                                                    title={
                                                        <Typography variant='caption'>
                                                            <Trans i18nKey={calculation.tooltip}
                                                                   components={[<sub/>, <p/>, <sup/>]}/>
                                                        </Typography>
                                                    }
                                                    placement="bottom-start"
                                                >
                                                    <Typography variant='body2' lineHeight={1.7} sx={{ml: 2}}
                                                                fontSize={15}
                                                                dangerouslySetInnerHTML={{__html: calculation.displayCalculation(activity)}}/>
                                                </HtmlTooltip>
                                            ))}
                                            {
                                                conditions && conditions.length > 0 &&
                                                <>
                                                    <Stack direction='row' alignItems='center' sx={{my: 2}} spacing={0.5}>
                                                        <Typography variant='button'>
                                                            {t("common.conditionCheck")}:
                                                        </Typography>
                                                        {
                                                            conditionTitleInfo &&
                                                            <InfoIcon
                                                                titleComponent={
                                                                    <Typography variant='caption'>
                                                                        <Trans i18nKey={conditionTitleInfo} components={[<sub/>]}/>
                                                                    </Typography>
                                                                }
                                                            />
                                                        }
                                                    </Stack>
                                                    {conditions.map((condition, index) => (
                                                        <HtmlTooltip
                                                            key={index}
                                                            title={
                                                                <Typography variant='caption'>
                                                                    <Trans i18nKey={condition.tooltip}
                                                                           components={[<sub/>, <p/>, <sup/>]}/>
                                                                </Typography>
                                                            }
                                                            placement="bottom-start"
                                                        >
                                                            <Typography variant='body2' lineHeight={1.7} sx={{ml: 2}}
                                                                        fontSize={15}
                                                                        dangerouslySetInnerHTML={{__html: condition.displayCalculation(activity)}}/>
                                                        </HtmlTooltip>
                                                    ))}
                                                </>
                                            }
                                        </Stack>
                                    </Stack>
                            }
                            <Box>
                                <IconButton
                                    color='primary'
                                    onClick={() => handleStep(index - 1)}
                                    disabled={index === 0}
                                >
                                    <ArrowCircleUpIcon fontSize='large'/>
                                </IconButton>
                                <IconButton
                                    color='primary'
                                    onClick={() => handleStep(index + 1)}
                                >
                                    <ArrowCircleDownIcon fontSize='large'/>
                                </IconButton>
                            </Box>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </Stack>
    )
}

export default React.forwardRef(CalculationStepper)