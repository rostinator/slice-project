import React from "react";
import {Link} from "react-router-dom";
import {Button} from "@mui/material";

interface LinkButtonProps {
    linkTo: string
    buttonText?: string
    icon?: React.ReactNode
}

const LinkButton: React.FC<LinkButtonProps> = ({linkTo, buttonText, icon}) => {

    return(
        <Button
            size='small'
            component={Link}
            to={linkTo}
            startIcon={icon}
            sx={{
                color: 'white'
            }}
        >
            {buttonText}
        </Button>
    )
}

export default LinkButton