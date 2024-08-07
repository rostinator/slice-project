import React from "react";
import {Link} from "@mui/material";
import {useNavigate} from "react-router";

interface TaskIdLinkProps {
    projectId?: number;
    taskId: number;
}

const TaskIdLink: React.FC<TaskIdLinkProps> = (props) => {
    const {
        projectId,
        taskId
    } = props

    const navigate = useNavigate();

    return(
        <Link
            component='button'
            variant='body2'
            underline='none'
            onClick={() => navigate("/ui/projects/" + projectId + "/tasks/" + taskId)}
        >
            {'@' + taskId}
        </Link>
    )
}

export default TaskIdLink