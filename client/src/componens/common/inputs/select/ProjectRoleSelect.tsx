import React from "react";
import SelectWithIcon, {FormSelectProps} from "./SelectWithIcon";
import {ProjectRole} from "../../../../model/enums";
import {projectRoleIcons} from "../EnumIcons";
import {useTranslation} from "react-i18next";

const ProjectRoleSelect: React.FC<FormSelectProps<ProjectRole>> = (props) => {

    const {t} = useTranslation()

    return (
        <SelectWithIcon<ProjectRole>
            {...props}
            inputLabelText={t("project.role")}
            selectItems={projectRoleIcons}
            translationNamespace="projectRole"
        />
    )
}

export default ProjectRoleSelect