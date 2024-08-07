import React from "react";
import SelectWithIcon, {FormSelectProps} from "./SelectWithIcon";
import {ViewMode} from "gantt-task-react";
import {viewModeIcons} from "../EnumIcons";

const ViewModeSelect: React.FC<FormSelectProps<ViewMode>> = (props) => {

    return (
        <SelectWithIcon<ViewMode>
            {...props}
            inputLabelText=''
            defaultValue={ViewMode.Day}
            selectItems={viewModeIcons}
            translationNamespace="viewMode"
        />
    )
}

export default ViewModeSelect