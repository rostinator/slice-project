import React from "react";
import OpenMenu from "../../OpenMenu";
import {Divider, ListItemIcon, ListItemText, MenuItem} from "@mui/material";
import Brightness1OutlinedIcon from '@mui/icons-material/Brightness1Outlined';
import BlockIcon from '@mui/icons-material/Block';
import {Nullable} from "../../../../model/models";
import SelectMenuBase from "./SelectMenuBase";
import {useTranslation} from "react-i18next";

export type MenuItemIcon<T> = {
    item: T;
    icon: React.ReactNode;
}

interface SelectMenuProps<T> {
    initValue: Nullable<T>;
    onChange: (newValue: Nullable<T>) => void;
    menuItems: MenuItemIcon<T>[];
    width?: number;
    notNull?: boolean;
    translationNamespace?: string;
}

const SelectMenu = <T extends string>(props: SelectMenuProps<T>) => {
    const {
        initValue,
        onChange,
        menuItems,
        width,
        notNull,
        translationNamespace,
    } = props

    const {t} = useTranslation()
    const [selectedValue, setSelectedValue] = React.useState<Nullable<T>>(initValue)

    const menuItemsMap = new Map(menuItems.map(obj => [obj.item, obj.icon]))

    type OpenMenuHandler = React.ElementRef<typeof OpenMenu>
    const openMenuRef = React.useRef<OpenMenuHandler>(null)

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        openMenuRef?.current?.handleOpenMenu(event)
    }

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        value: Nullable<T>,
    ) => {
        setSelectedValue(value)
        openMenuRef?.current?.handleCloseMenu()
        onChange(value)
    }

    return (
        <SelectMenuBase
            width={width}
            itemButtonComponent={
                <>
                    <ListItemIcon sx={{minWidth: 0}}>
                        {selectedValue ? menuItemsMap.get(selectedValue) : <Brightness1OutlinedIcon fontSize='small'/>}
                    </ListItemIcon>
                    <ListItemText
                        sx={{mx: 1, my: 0}}
                        primaryTypographyProps={{variant: 'body2'}}
                        primary={selectedValue ? (translationNamespace ? t(`${translationNamespace}.${selectedValue}`) : selectedValue) : ''}
                    />
                </>
            }
            openMenuRef={openMenuRef}
            handleOpenMenu={handleClickListItem}
        >
            {menuItems.map((value, index) => (
                <MenuItem
                    key={value.item.toString()}
                    selected={value.item === selectedValue}
                    onClick={(event) => handleMenuItemClick(event, value.item)}
                >
                    <ListItemIcon>
                        {value.icon}
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{variant: 'body2'}}>
                        {translationNamespace ? t(`${translationNamespace}.${value.item.toString()}`) : value.item.toString()}
                    </ListItemText>
                </MenuItem>
            ))}
            {(selectedValue && !notNull) && <Divider/>}
            {(selectedValue && !notNull) &&
                <MenuItem
                    onClick={(event) => handleMenuItemClick(event, null)}
                >
                    <ListItemIcon>
                        <BlockIcon color='disabled' fontSize='small'/>
                    </ListItemIcon>
                    <ListItemText
                        primaryTypographyProps={{variant: 'body2'}}
                        primary={t("common.none")}
                    />
                </MenuItem>}
        </SelectMenuBase>
    )
}

export default SelectMenu;