import React from "react";
// @ts-ignore
import styles from "./task-list-header.module.css";
import {useTranslation} from "react-i18next";

// SOURCE: https://github.com/MaTeMaTuK/gantt-task-react/blob/main/src/components/task-list/task-list-header.tsx
interface TaskListHeaderCustomProps {
    headerHeight: number;
    rowWidth: string;
    fontFamily: string;
    fontSize: string;
}

export const TaskListHeaderCustom: React.FC<TaskListHeaderCustomProps> = (props) => {
    const {
        headerHeight,
        rowWidth,
        fontFamily,
        fontSize
    } = props

    const {t} = useTranslation()

    const headerItemStyle = {
        minWidth: rowWidth,
        fontWeight: 'bold',
        paddingLeft: 15,
    }

    return (
        <div
            className={styles.ganttTable}
            style={{
                fontFamily: fontFamily,
                fontSize: fontSize,
            }}
        >
            <div
                className={styles.ganttTable_Header}
                style={{
                    height: headerHeight - 2,
                }}
            >
                <div
                    className={styles.ganttTable_HeaderItem}
                    style={headerItemStyle}
                >
                    {t("common.name")}
                </div>
                <div
                    className={styles.ganttTable_HeaderSeparator}
                    style={{
                        height: headerHeight * 0.5,
                        marginTop: headerHeight * 0.2,
                    }}
                />
                <div
                    className={styles.ganttTable_HeaderItem}
                    style={headerItemStyle}
                >
                    {t("common.from")}
                </div>
                <div
                    className={styles.ganttTable_HeaderSeparator}
                    style={{
                        height: headerHeight * 0.5,
                        marginTop: headerHeight * 0.25,
                    }}
                />
                <div
                    className={styles.ganttTable_HeaderItem}
                    style={headerItemStyle}
                >
                    {t("common.to")}
                </div>
            </div>
        </div>
    )
}

// export default TaskListHeaderCustom