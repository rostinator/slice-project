import React from "react";
import SelectWithIcon, {FormSelectProps} from "./SelectWithIcon";
import {Priority} from "../../../../model/enums";
import {priorityIcons} from "../EnumIcons";
import {useTranslation} from "react-i18next";

const PrioritySelect: React.FC<FormSelectProps<Priority>> = (props) => {
    const {t} = useTranslation();

    return (
        <SelectWithIcon<Priority>
            {...props}
            inputLabelText={props.hideLabel ? undefined : t("common.priority")}
            selectItems={priorityIcons}
            allowEmpty
            translationNamespace='priority'
        />
    )
}

export default PrioritySelect