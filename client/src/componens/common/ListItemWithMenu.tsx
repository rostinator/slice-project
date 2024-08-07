import React, {useState} from "react";
import {
    Collapse, Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {grey} from "@mui/material/colors";
import OpenMenu, {OpenMenuHandle} from "./OpenMenu";

interface ListItemWithMenuProps {
    primaryText: string;
    icon: React.ReactNode;
    menuItems: React.ReactNode[];
    collapseContent: React.ReactNode;
    openMenuRef: React.RefObject<OpenMenuHandle>;
    initialOpenState?: boolean;
}

const ListItemWithMenu: React.FC<ListItemWithMenuProps> = (props) => {
    const [openCollapse, setOpenCollapse] = useState<boolean>(!!props.initialOpenState)

    return (
        <>
            <ListItem
                sx={{my: 0.5}}
                disablePadding
                secondaryAction={
                    <IconButton
                        edge="end"
                        size="small"
                        aria-label="More"
                        onClick={(e) => props.openMenuRef?.current?.handleOpenMenu(e)}
                    >
                        <MoreHorizIcon fontSize="small"/>
                    </IconButton>
                }
            >
                <ListItemButton
                    onClick={() => {
                        setOpenCollapse(prevState => !prevState)
                    }}
                >
                    <ListItemIcon sx={{flexGrow: 0}}>
                        {props.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={props.primaryText}
                        primaryTypographyProps={{
                            color: grey[900],
                            letterSpacing: 0,
                        }}
                    />
                </ListItemButton>
            </ListItem>
            <OpenMenu
                ref={props.openMenuRef}
                dense
                toRight
                padding={0.5}
            >
                {props.menuItems}
            </OpenMenu>
            <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                {props.collapseContent}
            </Collapse>
            <Divider/>
        </>
    )
}

export default ListItemWithMenu