import React from "react";
import {Status} from "../../../../model/enums";
import SelectMenu from "./SelectMenu";
import {statusIcons} from "../EnumIcons";

interface SelectStatusMenuProps {
    initValue: Status | null;
    onChange(status: Status | null): void;
    width?: number;
}

const SelectStatusMenu: React.FC<SelectStatusMenuProps> = ({initValue, onChange, width}) => {
    return (
        <SelectMenu<Status>
            initValue={initValue}
            onChange={onChange}
            menuItems={statusIcons}
            width={width}
            translationNamespace="status"
            notNull
        />
    )
}

export default SelectStatusMenu