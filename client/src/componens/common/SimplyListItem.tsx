import React from "react";
import {IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import {grey} from "@mui/material/colors";

interface SimplyListItemProps {
    primaryText: string;
    icon: React.ReactNode;
    onClick(): void;
    selected?: boolean;
}

const SimplyListItem: React.FC<SimplyListItemProps> = (props) => {

    return (
        <ListItem
            disablePadding
            sx={{
                mb: 0.3,
                backgroundColor: props.selected ? grey[400] : '',
            }}
            secondaryAction={
                <IconButton
                    sx={{borderRadius: '20%'}}
                    edge="end"
                    size="small"
                    aria-label="More"
                    onClick={props.onClick}
                >
                    <ArrowRightOutlinedIcon fontSize='small'/>
                </IconButton>
            }
        >
            <ListItemButton
                onClick={props.onClick}
            >
                <ListItemIcon
                    sx={{
                        flexGrow: 0,
                        minWidth: 0,
                        mr: 1.5
                    }}
                >
                    {props.icon}
                </ListItemIcon>
                <ListItemText
                    primaryTypographyProps={{
                        color: grey[900],
                        fontWeight: props.selected ? 'bold' : 'normal'
                    }}
                    primary={props.primaryText}
                />
            </ListItemButton>
        </ListItem>
    )
}
export default SimplyListItem