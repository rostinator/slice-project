import React from "react";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {Fade, Tooltip, tooltipClasses, TooltipProps} from "@mui/material";
import {styled} from "@mui/material/styles";

export const HtmlTooltip = styled(({className, ...props}: TooltipProps) => (
    <Tooltip {...props} classes={{popper: className}} TransitionComponent={Fade} TransitionProps={{timeout: 600}}
             slotProps={{
                 popper: {
                     sx: {
                         [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                             {
                                 marginTop: '2px',
                             },
                         [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                             {
                                 marginBottom: '2px',
                             },
                     },
                 },
             }}/>
))(({theme}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 400,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));

interface InfoIconProps {
    titleComponent?: React.ReactNode;
    titleText?: string;
}

const InfoIcon: React.FC<InfoIconProps> = (props) => {
    const {
        titleComponent,
        titleText,
    } = props

    return (
        <HtmlTooltip
            title={titleComponent ? titleComponent : titleText}
        >
            <InfoOutlinedIcon color='info' fontSize='small'/>
        </HtmlTooltip>
    )
}

export default InfoIcon