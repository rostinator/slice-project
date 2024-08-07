import React from "react";
import SelectMenuBase from "./SelectMenuBase";
import OpenMenu from "../../OpenMenu";
import {Divider, MenuItem} from "@mui/material";
import {ProjectMember, User} from "../../../../model/models";
import MenuItemAvatar from "../MenuItemAvatar";

interface SelectUserMenuProps {
    initValue?: ProjectMember;
    availableProjectMembers: ProjectMember[];
    onChange(assignedUser?: ProjectMember): void;
    width?: number;
}

const SelectUserMenu: React.FC<SelectUserMenuProps> = (props) => {
    const {
        initValue,
        availableProjectMembers,
        onChange,
        width
    } = props

    const [selectedValue, setSelectedValue] = React.useState<ProjectMember | undefined>(initValue)

    type OpenMenuHandler = React.ElementRef<typeof OpenMenu>
    const openMenuRef = React.useRef<OpenMenuHandler>(null)

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        openMenuRef?.current?.handleOpenMenu(event)
    }

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        value?: ProjectMember,
    ) => {
        setSelectedValue(value)
        openMenuRef?.current?.handleCloseMenu()
        onChange(value)
    }

    return (
        <SelectMenuBase
            width={width}
            itemButtonComponent={
                <MenuItemAvatar firstName={selectedValue?.firstName} lastName={selectedValue?.lastName} size={25} typographyVariant='body2'/>
            }
            openMenuRef={openMenuRef}
            handleOpenMenu={handleClickListItem}
        >
            <MenuItem
                selected={!selectedValue}
                onClick={(event) => handleMenuItemClick(event)}
            >
                <MenuItemAvatar size={25} typographyVariant='body2'/>
            </MenuItem>
            <Divider />
            {availableProjectMembers.map((value, index) => (
                <MenuItem
                    key={value.userId}
                    selected={value === selectedValue}
                    onClick={(event) => handleMenuItemClick(event, value)}
                >
                    <MenuItemAvatar firstName={value.firstName} lastName={value.lastName} size={25} typographyVariant='body2'/>
                </MenuItem>
            ))}
        </SelectMenuBase>
    )
}

export default SelectUserMenu