import React, {useState} from "react";
import EditableTypography from "./EditableTypography";
import {Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import {useTranslation} from "react-i18next";

interface EditableDescriptionTypographyProps {
    initValue?: string;
    enableEdit: boolean;
    handleChangeValue(newValue: string): void;
}

const EditableDescriptionTypography: React.FC<EditableDescriptionTypographyProps> = (props) => {
    const {
        initValue,
        enableEdit,
        handleChangeValue,
    } = props

    const {t} = useTranslation()
    const [editDescription, setEditDescription] = useState<boolean>(false)
    const [description, setDescription] = useState<string | undefined>(initValue)

    return (
        <>
            {editDescription && enableEdit ?
                <EditableTypography variant='subtitle1' initValue={description}
                                    onChange={value => {
                                        setDescription(value.trim())
                                        handleChangeValue(value.trim())
                                        setEditDescription(false)
                                    }}/>
                :
                <Typography
                    variant='subtitle1'
                    onClick={() => setEditDescription(true)}

                    sx={{
                        border: 1,
                        p: 1,
                        fontStyle: description ? '' : 'italic',
                        borderRadius: 2,
                        borderColor: 'white',
                        "&:hover": {
                            borderColor: grey[500]
                        }
                    }}
                >
                    {description ? description : t("common.description") + "..."}
                </Typography>
            }
        </>
    )
}

export default EditableDescriptionTypography