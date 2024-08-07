import React from "react";
import {ProjectRole} from "../../../../model/enums";
import SelectMenu from "./SelectMenu";
import {projectRoleIcons} from "../EnumIcons";
import {Nullable} from "../../../../model/models";

interface SelectProjectRoleMenuProps {
    initValue: ProjectRole;
    onChange(status: Nullable<ProjectRole>): void;
    width?: number;
}

const SelectProjectRoleMenu: React.FC<SelectProjectRoleMenuProps> = ({initValue, onChange, width}) => {
    return (
        <SelectMenu<ProjectRole>
            initValue={initValue}
            onChange={onChange}
            menuItems={projectRoleIcons}
            width={width}
            notNull
            translationNamespace="projectRole"
        />
    )
}

export default SelectProjectRoleMenu