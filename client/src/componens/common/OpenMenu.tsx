import React, {PropsWithChildren, useState} from "react";
import {Menu} from "@mui/material";


export interface OpenMenuProps extends PropsWithChildren {
    dense?: boolean,
    padding?: number,
    toRight?: boolean,
    parentWidth?: boolean
}

export type OpenMenuHandle = {
    handleOpenMenu: (event: React.MouseEvent<HTMLElement>) => void;
    handleCloseMenu: () => void;
};

const OpenMenu: React.ForwardRefRenderFunction<OpenMenuHandle, OpenMenuProps> = (
    {children, dense, padding, toRight, parentWidth},
    forwardedRef,
) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [open, setOpen] = useState<boolean>(false)

    React.useImperativeHandle(forwardedRef, () => ({
        handleOpenMenu(event: React.MouseEvent<HTMLElement>) {
            setAnchorEl(event.currentTarget)
            setOpen(true)
        },
        handleCloseMenu() {
            innerHandleCloseMenu()
        }
    }))

    const innerHandleCloseMenu = (): void => {
        // setAnchorEl(null)
        setOpen(false)
    }

    return (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: toRight ? 'left' : 'right',
            }}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: toRight ? 'left' : 'right',
            }}
            open={open}

            onClose={innerHandleCloseMenu}
            MenuListProps={{
                dense: dense,
                disablePadding: Boolean(padding),
            }}
            slotProps={{paper: {sx: {p: padding, minWidth: (parentWidth ? anchorEl?.clientWidth : '')}}}}
        >
            {children}
        </Menu>
    )
}

export default React.forwardRef(OpenMenu)