import React, {useEffect, useState} from "react";
import {Gantt, Task, ViewMode} from "gantt-task-react"
import "gantt-task-react/dist/index.css";
import {TaskListHeaderCustom} from "./TaskListHeaderCustom";
import {StandardTooltipContent} from "./CustomTooltipContent";
import {Box, Stack, Typography} from "@mui/material";
import ViewModeSelect from "../common/inputs/select/ViewModeSelect";
import {Task as ModelTask} from "../../model/models";
import {TaskAPI} from "../../api/TaskAPI";
import {withSnackbar, WithSnackbarProps} from "../common/feedback/Snackbar";
import {useTranslation} from "react-i18next";
import {CpmModel} from "../../methods/cpm/CpmModel";
import {grey, red} from "@mui/material/colors";

interface GanttChartPanelProps extends WithSnackbarProps {
    modelTasks: ModelTask[];
    editable: boolean;
}

const GanttChartPanel: React.FC<GanttChartPanelProps> = (props) => {
    const {
        modelTasks,
        editable,
        showAlert,
    } = props

    const mapModelTasksToGanttTasks = (tasks: ModelTask[]): Task[] => {
        const cpmModel = CpmModel.initFromTask(tasks)

        const taskCopy = tasks.slice()
        taskCopy.sort((a, b) => a.startDate < b.startDate ? -1 : a.startDate > b.startDate ? 1 : 0)


        const ganttTasks: Task[] = []
        for (let i = 0; i < taskCopy.length; i++) {
            const task = taskCopy[i]

            const start = new Date(task.startDate)
            start.setHours(0)
            start.setMinutes(0)
            start.setSeconds(0)

            const end = new Date(task.endDate)
            end.setHours(23)
            end.setMinutes(59)
            end.setSeconds(59)

            const isCritical = cpmModel.isCriticalActivity(task.id)

            ganttTasks.push({
                id: task.id.toString(),
                type: 'task',
                name: task.name,
                start: start,
                end: end,
                isDisabled: !editable,
                progress: task.progress ? task.progress : 0,
                displayOrder: i + 1,
                dependencies: task.taskPredecessor.map(p => p.relatedTaskId.toString()),
                styles: {
                    backgroundColor: isCritical? red[500] : grey[400],
                    backgroundSelectedColor: isCritical? red[800] : grey[600],
                    progressColor: isCritical? red[900] : grey[600],
                    progressSelectedColor: isCritical? red[900] : grey[800]
                }
            })
        }

        return ganttTasks
    }

    useEffect(() => {
        setTasks(mapModelTasksToGanttTasks(modelTasks))
    }, modelTasks)

    const {t} = useTranslation()

    const [tasks, setTasks] = useState<Task[]>(mapModelTasksToGanttTasks(modelTasks))
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day)

    const mapGanttTaskToModelTasks = (ganttTask: Task) => {
        const taskId = parseInt(ganttTask.id)
        const modelTask = modelTasks.find(t => t.id === taskId);
        if (modelTask) {
            let update = false
            if (modelTask.endDate !== ganttTask.end) {
                modelTask.endDate = ganttTask.end
                update = true
            }
            if (modelTask.startDate !== ganttTask.start) {
                modelTask.startDate = ganttTask.start
                update = true
            }
            if (modelTask.progress !== ganttTask.progress) {
                modelTask.progress = ganttTask.progress
                update = true
            }

            if (update) updateTask(modelTask)
        } else {
            showAlert(t("common.somethingWentWrong"), 'error')
        }
    }

    const updateTask = (task: ModelTask) => {
        TaskAPI.update(task)
            .then(response => {
                if (!response.isSuccessful) {
                    showAlert(t("common.somethingWentWrong"), 'error')
                }
            })
    }

    const handleTaskChange = (ganttTask: Task) => {
        setTasks(prevState => prevState.map(t => (t.id === ganttTask.id ? ganttTask : t)))
        mapGanttTaskToModelTasks(ganttTask)
    }

    const handleTaskDelete = (ganttTask: Task) => {
        const conf = window.confirm("Are you sure about " + ganttTask.name + " ?")
        if (conf) {
            setTasks(tasks.filter(t => t.id !== ganttTask.id))
        }
        return conf
    };

    const handleProgressChange = async (ganttTask: Task) => {
        setTasks(prevState => prevState.map(t => (t.id === ganttTask.id ? ganttTask : t)))
        mapGanttTaskToModelTasks(ganttTask)
    }

    const handleDblClick = (task: Task) => {
        alert("On Double Click event Id:" + task.id)
    }

    const handleClick = (task: Task) => {
        console.log("On Click event Id:" + task.id)
    }

    const handleSelect = (task: Task, isSelected: boolean) => {
        console.log(task.name + " has " + (isSelected ? "selected" : "unselected"))
    }

    const handleExpanderClick = (task: Task) => {
        setTasks(tasks.map(t => (t.id === task.id ? task : t)))
        console.log("On expander click Id:" + task.id)
    }

    return (
        <Stack spacing={2}>
            {modelTasks.length > 0 ?
                <>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <Box sx={{flexGrow: 1}}>
                            <Typography variant='h6'>
                                {t("ganttChart.title")}
                            </Typography>
                        </Box>
                        <Box minWidth={160}>
                            <ViewModeSelect
                                name='viewModeSelect'
                                error={false}
                                onChange={event => setViewMode(event.target.value as ViewMode)}
                            />
                        </Box>
                    </Box>

                    <Gantt
                        tasks={tasks}
                        viewMode={viewMode}
                        onDateChange={handleTaskChange}
                        onDelete={handleTaskDelete}
                        onProgressChange={handleProgressChange}
                        onDoubleClick={handleDblClick}
                        onClick={handleClick}
                        onSelect={handleSelect}
                        onExpanderClick={handleExpanderClick}
                        listCellWidth={"170px"}
                        columnWidth={65}
                        locale="cze"
                        TaskListHeader={TaskListHeaderCustom}
                        TooltipContent={StandardTooltipContent}
                    />
                </>
                :
                <div>

                </div>
            }
        </Stack>
    )
}
export default withSnackbar(GanttChartPanel)