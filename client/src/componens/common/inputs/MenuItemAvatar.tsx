import React from "react";
import {Avatar, ListItemText, Stack} from "@mui/material";
import {User} from "../../../model/models";
import {stringToColor, userInitials} from "../../../utils/commonUtils";
import {Variant} from "@mui/material/styles/createTypography";

const defaultAvatarSize = 30

function stringAvatar(firstName: string, lastName: string, size: number = defaultAvatarSize) {
    return {
        sx: {
            bgcolor: stringToColor(`${firstName} ${lastName}`),
            width: size,
            height: size,
            fontSize: size < 30 ? 'small' : 'medium'
        },
        children: userInitials(firstName, lastName),
    };
}

interface MenuItemAvatarProps {
    size?: number;
    firstName?: string;
    lastName?: string;
    typographyVariant?: Variant;
}

const MenuItemAvatar: React.FC<MenuItemAvatarProps> = (props) => {
    const {
        size,
        firstName,
        lastName,
        typographyVariant,
    } = props

    return (
        <Stack alignItems='center' direction='row' spacing={1} sx={{width: '100%'}}>
            {firstName && lastName ?
                <Avatar {...stringAvatar(firstName, lastName, size)} />
                :
                <Avatar sx={{
                    width: size ? size : defaultAvatarSize,
                    height: size ? size : defaultAvatarSize
                }}
                />
            }
            <ListItemText
                primaryTypographyProps={{variant: typographyVariant}}
                primary={firstName && lastName ? `${firstName} ${lastName}` : ''}
            />
        </Stack>
    )
}

export default MenuItemAvatar