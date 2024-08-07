import React from "react";
import {SelectProps} from "@mui/material/Select/Select";
import {
    Divider,
    FormControl,
    FormHelperText,
    InputLabel,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select
} from "@mui/material";
import {MenuItemIcon} from "../menu/SelectMenu";
import {SelectInputProps} from "@mui/material/Select/SelectInput";
import BlockIcon from '@mui/icons-material/Block';
import {useTranslation} from "react-i18next";

export interface FormSelectProps<T> {
    text?: string;
    name: string;
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onChange?: SelectInputProps<T>['onChange'];
    error?: boolean;
    defaultValue?: T;
    hideLabel?: boolean;
    readOnly?: boolean;
}

interface SelectWithIconProps<T> extends SelectProps<T> {
    text?: string;
    inputLabelText?: string;
    defaultValue?: T;
    selectItems: MenuItemIcon<T>[];
    allowEmpty?: boolean;
    translationNamespace?: string;
    readOnly?: boolean;
}

const SelectWithIcon = <T extends string>(props: SelectWithIconProps<T>) => {
    const {
        text,
        inputLabelText,
        defaultValue,
        selectItems,
        allowEmpty,
        translationNamespace,
        error,
        onChange,
        onBlur,
        name,
        readOnly,
    } = props

    const {t} = useTranslation()

    const selectItemsMap = new Map(selectItems.map(obj => [obj.item, obj.icon]));

    return (
        <FormControl fullWidth>
            {inputLabelText && <InputLabel required={!allowEmpty} size='small' id="select-label">{inputLabelText}</InputLabel>}
            <Select
                required={!allowEmpty}
                readOnly={readOnly}
                labelId="select-label"
                error={error}
                onChange={onChange}
                onBlur={onBlur}
                label={inputLabelText}
                // @ts-ignore
                defaultValue={defaultValue ? defaultValue : ''}
                name={name}
                size={'small'}
                renderValue={value => (
                    <MenuItem disableGutters disableRipple key={value} value={value}
                              sx={{':hover': {backgroundColor: 'white'}, p: 0}}>
                        <ListItemIcon>
                            {selectItemsMap.get(value)}
                        </ListItemIcon>
                        <ListItemText
                            primaryTypographyProps={{fontWeight: 'bold'}}
                            primary={translationNamespace ? t(`${translationNamespace}.${value}`)  : value}
                        />
                    </MenuItem>
                )}
            >
                {selectItems.map((value) => (
                    <MenuItem key={value.item} value={value.item}>
                        <ListItemIcon>
                            {value.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={translationNamespace ? t(`${translationNamespace}.${value.item.toString()}`)  : value.item.toString()}
                        />
                    </MenuItem>
                ))}
                {allowEmpty && <Divider/>}
                {allowEmpty &&
                    <MenuItem value="">
                        <ListItemIcon>
                            <BlockIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText primary={t("common.none")}/>
                    </MenuItem>
                }
            </Select>
            {error &&
                <FormHelperText error>{text}</FormHelperText>
            }
        </FormControl>
    )
}

export default SelectWithIcon