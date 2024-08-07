import React from "react";
import {Task} from "gantt-task-react";
// @ts-ignore
import styles from "./tooltip-content.module.css";
import {dateDiffInDays, formatDate} from "../../utils/commonUtils";
import {useTranslation} from "react-i18next";

// Source: https://github.com/MaTeMaTuK/gantt-task-react/blob/main/src/components/other/tooltip.tsx

interface StandardTooltipContentProps {
    task: Task;
    fontSize: string;
    fontFamily: string;
}

export const StandardTooltipContent: React.FC<StandardTooltipContentProps> = (props) => {
    const {
        task,
        fontSize,
        fontFamily
    } = props

    const {t} = useTranslation()

    const style = {
        fontSize,
        fontFamily,
    }

    return (
        <div className={styles.tooltipDefaultContainer} style={style}>
            <b style={{fontSize: fontSize + 6}}>
                {`${task.name}: ${formatDate(task.start)} - ${formatDate(task.end)}`}
            </b>
            <p className={styles.tooltipDefaultContainerParagraph}>
                {t("ganttChart.tooltipDuration", {day: dateDiffInDays(task.start, task.end)})}
            </p>
            <p className={styles.tooltipDefaultContainerParagraph}>
                {t("ganttChart.tooltipProgress", {progress: task.progress})}
            </p>
        </div>
    );
};