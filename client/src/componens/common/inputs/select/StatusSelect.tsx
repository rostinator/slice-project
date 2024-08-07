import React from "react";
import SelectWithIcon, {FormSelectProps} from "./SelectWithIcon";
import {Status} from "../../../../model/enums";
import {statusIcons} from "../EnumIcons";

const StatusSelect: React.FC<FormSelectProps<Status>> = (props) => {
    return (
        <SelectWithIcon<Status>
            {...props}
            inputLabelText={props.hideLabel ? undefined : 'Status'}
            selectItems={statusIcons}
            translationNamespace='status'
        />
    )
}

export default StatusSelect