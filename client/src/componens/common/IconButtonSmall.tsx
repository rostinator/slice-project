import React from "react";
import {IconButton} from "@mui/material";
import {IconButtonProps} from "@mui/material/IconButton/IconButton";

interface SmallIconButtonProps extends IconButtonProps {
    icon: React.ReactNode,
}

const IconButtonSmall: React.FC<SmallIconButtonProps> = (props) => {

    return (
        <IconButton sx={{borderRadius: '20%'}} size='small' {...props}>
            {props.icon}
        </IconButton>
    )
}

export default IconButtonSmall