import React, {useState} from "react";
import {Box, Button, Collapse, Typography, useTheme} from "@mui/material";
import {Project} from "../../model/models";
import IconButtonSmall from "../common/IconButtonSmall";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {useNavigate} from "react-router";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

interface ProjectListItemProps {
    project: Project
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({project}) => {
    const theme = useTheme();
    const navigate = useNavigate()
    const [openCollapse, setOpenCollapse] = useState<boolean>(false)

    return (
        <Box
            border={1}
            borderColor={theme.palette.divider}
            borderRadius={1}
            mb={1}
        >
            <Box
                m={1}
                display='flex'
                alignItems='center'
            >
                <IconButtonSmall
                    icon={openCollapse ? <ArrowDropDownIcon/> : <ArrowRightIcon/>}
                    onClick={() => setOpenCollapse(prevState => !prevState)}
                />
                <Button
                    variant="text"
                    color="inherit"
                    onClick={() => {
                        navigate('/ui/projects/' + project.id)
                    }}
                >
                    {project?.name}
                </Button>
                <IconButtonSmall
                    icon={<MoreHorizIcon/>}
                    onClick={() => {
                    }}
                />

            </Box>
            <Collapse in={openCollapse}>
                <Box ml={2.5} mb={2}>
                    <Typography variant='body2'>
                        {project.description}
                    </Typography>
                </Box>
            </Collapse>
        </Box>
    )
}

export default ProjectListItem