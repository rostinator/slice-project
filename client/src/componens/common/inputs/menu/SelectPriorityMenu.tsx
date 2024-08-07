import React from "react";
import {Priority} from "../../../../model/enums";
import SelectMenu from "./SelectMenu";
import {Nullable} from "../../../../model/models";
import {priorityIcons} from "../EnumIcons";


interface SelectPriorityMenuProps {
    initValue: Nullable<Priority>;
    onChange(priority: Nullable<Priority>): void;
    width?: number;
}

const SelectPriorityMenu: React.FC<SelectPriorityMenuProps> = ({initValue, onChange, width}) => {
    return (
        <SelectMenu<Priority>
            initValue={initValue}
            menuItems={priorityIcons}
            onChange={onChange}
            width={width}
            translationNamespace="priority"
        />
    )
}

export default SelectPriorityMenu