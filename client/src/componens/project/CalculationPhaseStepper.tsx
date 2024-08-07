import React, {useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    IconButton, Stack,
    Step,
    StepButton,
    Stepper,
    Typography
} from "@mui/material";
import TabPanel from "../common/TabPanel";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InfoIcon from "../common/InfoIcon";
import {Trans} from "react-i18next";

export interface StepContent {
    label: string;
    caption: string;
    content: React.ReactNode;
}

interface CalculationPhaseStepperProps {
    steps: StepContent[];
    calculationTitle: string;
    calculationTitleDescription: string;
}

const CalculationPhaseStepper: React.FC<CalculationPhaseStepperProps> = (props) => {
    const {
        steps,
        calculationTitle,
        calculationTitleDescription,
    } = props

    const [activeStep, setActiveStep] = useState<number>(0)

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    return (
        <Accordion
            variant='outlined'
            sx={{mb: 0.5}}
            defaultExpanded
        >
            <AccordionSummary expandIcon={<KeyboardArrowDownIcon/>}>
                <Stack direction='row' alignItems='center' spacing={0.5}>
                    <Typography variant='h6'>{calculationTitle}</Typography>
                    <InfoIcon
                        titleComponent={
                            <Typography variant='caption'>
                                <Trans i18nKey={calculationTitleDescription} components={[<i/>, <sub/>]}/>
                            </Typography>
                        }
                    />
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{minWidth: '100%', overflow: {xs: 'auto', sm: 'unset'}}}>
                    <Stepper nonLinear activeStep={activeStep} orientation="horizontal">
                        {steps.map((step, index) => (
                            <Step key={step.label}>
                                <StepButton
                                    optional={
                                        <Typography variant="caption">{step.caption}</Typography>
                                    }
                                    onClick={handleStep(index)}
                                >
                                    <Typography variant='h6'>{step.label}</Typography>
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                {steps.map((step, index) => (
                    <TabPanel key={index} value={activeStep} index={index}>
                        {step.content}
                    </TabPanel>
                ))}

                <Box>
                    <IconButton
                        color='primary'
                        onClick={handleStep(activeStep - 1)}
                        disabled={activeStep === 0}
                    >
                        <ArrowCircleLeftOutlinedIcon fontSize='large'/>
                    </IconButton>
                    <IconButton
                        color='primary'
                        onClick={handleStep(activeStep + 1)}
                        disabled={activeStep === (steps.length - 1)}
                    >
                        <ArrowCircleRightOutlinedIcon fontSize='large'/>
                    </IconButton>
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}

export default CalculationPhaseStepper