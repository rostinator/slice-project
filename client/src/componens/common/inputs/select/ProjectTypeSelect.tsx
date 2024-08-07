import React from "react";
import SelectWithIcon, {FormSelectProps} from "./SelectWithIcon";
import {ProjectType} from "../../../../model/enums";
import {projectTypeIcons} from "../EnumIcons";
import {useTranslation} from "react-i18next";

const ProjectTypeSelect: React.FC<FormSelectProps<ProjectType>> = (props) => {

    const {t} = useTranslation()

    return (
        <SelectWithIcon<ProjectType>
            {...props}
            inputLabelText={t("common.type")}
            defaultValue={ProjectType.PRIVATE}
            selectItems={projectTypeIcons}
            translationNamespace="projectType"
        />
    )
}

export default ProjectTypeSelect