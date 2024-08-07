import React, {useState} from "react";
import {PertModel} from "../../../methods/pert/PertModel";
import {Alert, Box, Stack, TextField, Typography} from "@mui/material";
import InfoIcon, {HtmlTooltip} from "../../common/InfoIcon";
import {Trans, useTranslation} from "react-i18next";

interface PertFinalStepCalculationProps {
    pertModel: PertModel;
    projectId: number;
}

const PertFinalStepCalculation: React.FC<PertFinalStepCalculationProps> = (props) => {
    const {
        pertModel,
        projectId,
    } = props

    const {jStat} = require('jstat')

    const {t} = useTranslation()
    const criticalActivities = pertModel.criticalActivities()
    const projectTotalDuration = pertModel.calculateProjectTotalDuration()
    const projectStandardDeviation = Math.sqrt(pertModel.calculateTotalProjectDispersion())

    const [tp, setTp] = useState<string>(projectTotalDuration.toFixed(3))
    const [p, setP] = useState<string>("0.95")

    const buildAverageProjectDurationEquations = (): string => {
        return `𝜇<sub>T</sub> = &sum;<sub>K</sub>𝜇<sub>i</sub> = ${criticalActivities.map(a => `𝜇<sub>${a.name}</sub>`).join(" + ")} =
                ${criticalActivities.map(a => a.duration.toFixed(3)).join(" + ")} = <strong>${projectTotalDuration.toFixed(3)}</strong>`
    }

    const buildTotalProjectDispersionEquations = (): string => {
        return `𝜎<sup>2</sup><sub>T</sub> = &sum;<sub>K</sub>𝜎<sup>2</sup><sub>i</sub> = ${criticalActivities.map(a => `𝜎<sup>2</sup><sub>${a.name}</sub>`).join(" + ")} =
                ${criticalActivities.map(a => a.dispersion?.toFixed(3)).join(" + ")} = <strong>${pertModel.calculateTotalProjectDispersion().toFixed(3)}</strong>`
    }

    const buildProjectStandardDeviationEquations = (): string => {
        return `𝜎<sub>T</sub> = &radic;𝜎<sup>2</sup><sub>T</sub> = &radic;${pertModel.calculateTotalProjectDispersion().toFixed(3)} =
                <strong>${projectStandardDeviation.toFixed(3)}</strong>`
    }

    const buildCompletionTimeProbabilityEquations = (): string => {
        const tpNum = tp ? parseInt(tp) : null
        if (!tpNum) return ""

        const projectStandardDeviation = Math.sqrt(pertModel.calculateTotalProjectDispersion())
        const distributionFunctionPoint = (tpNum - projectTotalDuration) / projectStandardDeviation
        const cdf = jStat.normal.cdf(distributionFunctionPoint, 0, 1)
        return `p(T &le; T<sub>P</sub>) = 𝜑 [︂(T<sub>P</sub> − 𝜇<sub>T</sub>) / 𝜎<sub>T</sub>] <br>
                p(T &le; ${tp}) = 𝜑 [︂(${tp}  − ${projectTotalDuration.toFixed(3)}) / ${projectStandardDeviation.toFixed(3)}] =
                𝜑 [${distributionFunctionPoint.toFixed(3)}] = ${cdf.toFixed(3)} = <strong>${(cdf * 100).toFixed(3)}%</strong>`
    }

    const buildProjectCompletionTimeProbabilityEquations = (): string => {
        const pNum = p ? parseFloat(p) : null
        if (!pNum || pNum < 0 || pNum > 1) return ""
        const quantileValue = jStat.normal.inv(pNum, 0, 1)
        const calculatedTp = (quantileValue * projectStandardDeviation) + projectTotalDuration;

        return `𝜑[${quantileValue.toFixed(3)}] = ${pNum}<br>
                (T<sub>P</sub> - ${projectTotalDuration.toFixed(3)}) / ${projectStandardDeviation} = ${quantileValue.toFixed(3)}<br>
                T<sub>P</sub> = <strong>${calculatedTp.toFixed(3)}</strong>`
    }

    return (
        <Stack spacing={2}>
            <Stack direction='row' alignItems='center' spacing={0.5}>
                <Typography variant='h6'>{t("pert.lastStepCalculationTitle")}</Typography>
                <InfoIcon
                    titleComponent={
                        <Typography variant='caption'>
                            <Trans i18nKey='pert.lastStepCalculationTitleDescription' components={[<sub/>, <sup/>]}/>
                        </Typography>
                    }
                />
            </Stack>

            {
                pertModel.isCpmCalculated() ?
                    <Stack pl={2} spacing={1}>
                        <Typography variant='button'>{t("pert.averageProjectDuration")}</Typography>

                        <HtmlTooltip
                            title={
                                <Typography variant='caption'>
                                    <Trans i18nKey='pert.averageProjectDurationCaption' components={[<sub/>]}/>
                                </Typography>
                            }
                            placement="bottom-start"
                        >
                            <Typography variant='overline' lineHeight={2} sx={{ml: 2}} fontSize={14}
                                        dangerouslySetInnerHTML={{__html: buildAverageProjectDurationEquations()}}/>
                        </HtmlTooltip>

                        <Typography variant='button'>{t("pert.totalProjectDispersion")}</Typography>

                        <HtmlTooltip
                            title={
                                <Typography variant='caption'>
                                    <Trans i18nKey='pert.totalProjectDispersionCaption' components={[<sub/>]}/>
                                </Typography>
                            }
                            placement="bottom-start"
                        >
                            <Typography variant='overline' lineHeight={2} sx={{ml: 2}} fontSize={14}
                                        dangerouslySetInnerHTML={{__html: buildTotalProjectDispersionEquations()}}/>
                        </HtmlTooltip>

                        <Typography variant='button'>{t("pert.projectStandardDeviation")}</Typography>
                        <HtmlTooltip
                            title={
                                <Typography variant='caption'>
                                    <Trans i18nKey='pert.projectStandardDeviationCaption' components={[<sub/>]}/>
                                </Typography>
                            }
                            placement="bottom-start"
                        >
                            <Typography variant='overline' lineHeight={2} sx={{ml: 2}} fontSize={14}
                                        dangerouslySetInnerHTML={{__html: buildProjectStandardDeviationEquations()}}/>
                        </HtmlTooltip>

                        <Stack direction='row' alignItems='center' spacing={0.5}>
                            <Typography variant='button'>
                                <Trans i18nKey='pert.probabilityProjectCompletionTime' components={[<sub/>]}/>
                            </Typography>
                            <InfoIcon
                                titleComponent={
                                    <Typography variant='caption'>
                                        <Trans i18nKey='pert.probabilityProjectCompletionTimeDescription'
                                               components={[<sub/>]}/>
                                    </Typography>
                                }
                            />
                        </Stack>
                        <Box pb={1}>
                            <TextField
                                type="number"
                                label={<div>T<sub>P</sub> (dny)</div>}
                                variant="standard"
                                size='small'
                                value={tp}
                                onChange={event => setTp(event.target.value)}
                            />
                        </Box>
                        {
                            tp && parseInt(tp) &&
                            <Stack>
                                <Typography variant='overline' lineHeight={2} fontSize={14}
                                            dangerouslySetInnerHTML={{__html: buildCompletionTimeProbabilityEquations()}}/>
                            </Stack>
                        }

                        <Stack direction='row' alignItems='center' spacing={0.5}>
                            <Typography variant='button'>
                                <Trans i18nKey='pert.projectCompletionTimeProbability' components={[<i/>]}/>
                            </Typography>
                            <InfoIcon
                                titleComponent={
                                    <Typography variant='caption'>
                                        <Trans i18nKey='pert.projectCompletionTimeProbabilityDescription'
                                               components={[<sub/>, <i/>]}/>
                                    </Typography>
                                }
                            />
                        </Stack>

                        <Box pb={1}>
                            <TextField
                                type="number"
                                label="P"
                                variant="standard"
                                size='small'
                                InputProps={{ inputProps: { min: "0", max: "1", step: "0.01" } }}
                                value={p}
                                onChange={event => setP(event.target.value)}
                            />
                        </Box>
                        {
                            p && parseFloat(p) &&
                            <Stack>
                                <Typography variant='overline' lineHeight={2} fontSize={14}
                                            dangerouslySetInnerHTML={{__html: buildProjectCompletionTimeProbabilityEquations()}}/>
                            </Stack>
                        }
                    </Stack>
                    :
                    <Box display='flex' justifyContent='center'>
                        <Alert severity='error'>
                            {t("pert.cpmCalculationFailed")}
                        </Alert>
                    </Box>
            }
        </Stack>
    )
}

export default PertFinalStepCalculation