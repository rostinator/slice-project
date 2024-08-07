package cz.uhk.projectmgmt.dto;

import cz.uhk.projectmgmt.enums.PRIORITY;
import cz.uhk.projectmgmt.enums.TASK_STATUS;
import jakarta.persistence.Column;

import java.time.LocalDate;
import java.util.List;

public final class TaskDto {

    private Integer id;

    private String name;

    private PRIORITY priority;

    private TASK_STATUS status;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer progress;

    private Integer assignedUserId;

    private Integer projectId;

    private Integer optimisticEstimation;

    private Integer modalEstimation;

    private Integer pessimisticEstimation;

    private List<RelatedTaskDto> taskSuccessor;

    private List<RelatedTaskDto> taskPredecessor;

    public TaskDto(Integer id, String name, PRIORITY priority, TASK_STATUS status, String description, LocalDate startDate,
                   LocalDate endDate, Integer progress, Integer assignedUserId, Integer projectId, Integer optimisticEstimation,
                   Integer modalEstimation, Integer pessimisticEstimation, List<RelatedTaskDto> taskSuccessor, List<RelatedTaskDto> taskPredecessor) {
        this.id = id;
        this.name = name;
        this.priority = priority;
        this.status = status;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.progress = progress;
        this.assignedUserId = assignedUserId;
        this.projectId = projectId;
        this.optimisticEstimation = optimisticEstimation;
        this.modalEstimation = modalEstimation;
        this.pessimisticEstimation = pessimisticEstimation;
        this.taskSuccessor = taskSuccessor;
        this.taskPredecessor = taskPredecessor;
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public PRIORITY getPriority() {
        return priority;
    }

    public TASK_STATUS getStatus() {
        return status;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public Integer getProgress() {
        return progress;
    }

    public Integer getAssignedUserId() {
        return assignedUserId;
    }

    public Integer getProjectId() {
        return projectId;
    }

    public Integer getOptimisticEstimation() {
        return optimisticEstimation;
    }

    public Integer getModalEstimation() {
        return modalEstimation;
    }

    public Integer getPessimisticEstimation() {
        return pessimisticEstimation;
    }

    public List<RelatedTaskDto> getTaskSuccessor() {
        return taskSuccessor;
    }

    public void setTaskSuccessor(List<RelatedTaskDto> taskSuccessor) {
        this.taskSuccessor = taskSuccessor;
    }

    public List<RelatedTaskDto> getTaskPredecessor() {
        return taskPredecessor;
    }

    public void setTaskPredecessor(List<RelatedTaskDto> taskPredecessor) {
        this.taskPredecessor = taskPredecessor;
    }
}
