import React from "react";
import {Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent} from "@mui/material";
import {Task} from "../../../../model/models";

interface RelatedTaskSelectProps {
    availableRelatedTasks: Task[];
    value: string;
    label: string;
    setValue(newValue: string): void;
}

const RelatedTaskSelect: React.FC<RelatedTaskSelectProps> = (props) => {
    const {
        availableRelatedTasks,
        value,
        label,
        setValue,
    } = props

    const availableTaskItemsMap = new Map(availableRelatedTasks.map(obj => [obj.id.toString(), obj]));

    const handleChange = (event: SelectChangeEvent<typeof value>) => {
        setValue(event.target.value)
    }

    return (
        <FormControl fullWidth>
            <InputLabel size="small" id="previous-activities-chip-label">{label}</InputLabel>
            <Select
                size="small"
                labelId="previous-activities-chip-label"
                id="previous-activities-select"
                value={value}
                onChange={handleChange}
                fullWidth
                input={<OutlinedInput size="small" id="previous-activities-select" label={label}/>}
                renderValue={(selected) => (
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                        {selected && <Chip key={selected} label={availableTaskItemsMap.get(selected)?.name}/>}
                    </Box>
                )}
            >
                {availableRelatedTasks.map((task) => (
                    <MenuItem
                        key={task.id.toString()}
                        value={task.id.toString()}
                        // sx={{
                        //     fontWeight: selectedTasks.indexOf(task.id) === -1 ? 'normal' : 'bold'
                        // }}
                    >
                        {task.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default RelatedTaskSelect