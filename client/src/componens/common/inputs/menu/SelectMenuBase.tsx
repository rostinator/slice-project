import React, {PropsWithChildren} from "react";
import OpenMenu, {OpenMenuHandle} from "../../OpenMenu";
import {Box, List, ListItem, ListItemButton} from "@mui/material";

interface SelectMenuBaseProps extends PropsWithChildren {
    width?: number;
    itemButtonComponent: React.ReactNode;
    openMenuRef: React.RefObject<OpenMenuHandle>;
    handleOpenMenu(event: React.MouseEvent<HTMLElement>): void;
}

const SelectMenuBase: React.FC<SelectMenuBaseProps> = (props) => {
    const {
        width,
        itemButtonComponent,
        openMenuRef,
        handleOpenMenu,
        children,
    } = props

    return (
        <Box width={width}>
            <List disablePadding>
                <ListItem
                    disablePadding
                    alignItems='flex-start'
                    sx={{height: '100%'}}
                >
                    <ListItemButton
                        onClick={handleOpenMenu}
                        sx={{height: '100%'}}
                    >
                        {itemButtonComponent}
                    </ListItemButton>
                </ListItem>
            </List>
            <OpenMenu toRight parentWidth ref={openMenuRef}>
                {children}
            </OpenMenu>
        </Box>
    )
}

export default SelectMenuBase