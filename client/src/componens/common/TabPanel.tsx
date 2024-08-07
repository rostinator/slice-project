import React from "react";
import {Box} from "@mui/material";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    disablePadding?: boolean;
}

const TabPanel: React.FC<TabPanelProps> = ({value, index, disablePadding, children}) => {

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
        >
            {value === index && (
                <Box sx={{p: disablePadding ? 0 : 3}}>
                    {children}
                </Box>
            )}
        </div>
    )
}

export default TabPanel