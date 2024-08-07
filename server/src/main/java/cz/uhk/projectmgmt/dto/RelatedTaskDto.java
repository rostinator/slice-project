package cz.uhk.projectmgmt.dto;

import cz.uhk.projectmgmt.enums.TASK_STATUS;
import cz.uhk.projectmgmt.model.Task;
import cz.uhk.projectmgmt.model.TaskRelationship;

public class RelatedTaskDto {

    private Integer relatedTaskId;
    private String taskName;
    private TASK_STATUS taskStatus;
    private Integer minimumTimeGap;
    private Integer maximumTimeGap;

    public RelatedTaskDto(Integer relatedTaskId, String taskName, TASK_STATUS taskStatus, Integer minimumTimeGap, Integer maximumTimeGap) {
        this.relatedTaskId = relatedTaskId;
        this.taskName = taskName;
        this.taskStatus = taskStatus;
        this.minimumTimeGap = minimumTimeGap;
        this.maximumTimeGap = maximumTimeGap;
    }

    public Integer getRelatedTaskId() {
        return relatedTaskId;
    }

    public String getTaskName() {
        return taskName;
    }

    public TASK_STATUS getTaskStatus() {
        return taskStatus;
    }

    public Integer getMinimumTimeGap() {
        return minimumTimeGap;
    }

    public Integer getMaximumTimeGap() {
        return maximumTimeGap;
    }

    public static RelatedTaskDto mapTaskRelationshipToRelatedTaskDto(TaskRelationship taskRelationship, boolean reversed) {
        return new RelatedTaskDto(reversed ? taskRelationship.getTaskId() : taskRelationship.getRelatedTaskId(), null, null, taskRelationship.getMinimumTimeGap(), taskRelationship.getMaximumTimeGap());
    }

    public static RelatedTaskDto mapTaskToRelatedTaskDto(Task task) {
        return new RelatedTaskDto(task.getId(), task.getName(), task.getStatus(), null, null);
    }
}
