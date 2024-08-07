import React from "react";
import {FormSelectProps} from "./SelectWithIcon";
import {ProjectMember, User} from "../../../../model/models";
import {
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
} from "@mui/material";
import MenuItemAvatar from "../MenuItemAvatar";
import {useTranslation} from "react-i18next";

interface UserSelectProps extends FormSelectProps<string> {
    projectMembers: ProjectMember[];
    assignedUser?: string;
    hideLabel?: boolean;
}

const UserSelect: React.FC<UserSelectProps> = (props) => {
    const {
        projectMembers,
        assignedUser,
        hideLabel
    } = props

    const {t} = useTranslation()

    const selectItemsMap = new Map(projectMembers?.map(obj => [obj.userId, obj]))

    return (
        <FormControl fullWidth>
            {!hideLabel && <InputLabel size="small" id="assigned-user-label">{t("common.assignedUser")}</InputLabel>}
            <Select
                readOnly={props.readOnly}
                size="small"
                labelId={hideLabel ? undefined : "assigned-user-label"}
                id="assigned-user-select"
                error={props.error}
                onChange={props.onChange}
                onBlur={props.onBlur}
                name={props.name}
                defaultValue={assignedUser}
                fullWidth
                input={hideLabel ? undefined : <OutlinedInput size="small" id="assigned-user-select" label={t("common.assignedUser")}/>}
                renderValue={(selected) => (
                    <MenuItemAvatar firstName={selectItemsMap.get(parseInt(selected))?.firstName} lastName={selectItemsMap.get(parseInt(selected))?.lastName}/>
                )}
            >
                <MenuItem value="">
                    <MenuItemAvatar/>
                </MenuItem>
                <Divider/>
                {projectMembers?.map((user) => (
                    <MenuItem
                        key={user.userId}
                        value={user.userId}
                    >
                        <MenuItemAvatar firstName={user.firstName} lastName={user.lastName}/>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default UserSelect