import React from 'react';
import Typography from '@mui/material/Typography';
import {grey} from "@mui/material/colors";
import {Variant} from "@mui/material/styles/createTypography";

interface EditableTypographyProps {
    initValue?: string;
    onChange: (value: string) => void;
    variant?: Variant;
}

const EditableTypography: React.FC<EditableTypographyProps> = (props) => {
    const {
        initValue,
        onChange,
        variant,
    } = props

    const handleInput = (event: React.FocusEvent<HTMLSpanElement, Element>) => {
        onChange(event.target.innerText)
    }

    return (
        <Typography
            variant={variant}
            suppressContentEditableWarning
            contentEditable
            sx={{
                padding: 1,
                border: 1,
                borderRadius: 2,
                borderColor: 'white',
                "&:hover": {
                    borderColor: grey[500]
                }
            }}
            onBlur={handleInput}
        >
            {initValue}
        </Typography>
    )
}

export default EditableTypography
