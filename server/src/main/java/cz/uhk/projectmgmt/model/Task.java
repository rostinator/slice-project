package cz.uhk.projectmgmt.model;

import cz.uhk.projectmgmt.dto.RelatedTaskDto;
import cz.uhk.projectmgmt.dto.TaskDto;
import cz.uhk.projectmgmt.enums.PRIORITY;
import cz.uhk.projectmgmt.enums.TASK_STATUS;
import cz.uhk.projectmgmt.enums.TASK_RELATIONSHIP_TYPE;
import jakarta.persistence.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.validator.constraints.Range;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "TASKS")
public class Task extends EntityWithChanges implements EntityWithDTO<TaskDto> {

    @Column(nullable = false)
    private String name;

    @Column
    @Enumerated(EnumType.STRING)
    private PRIORITY priority;

    @Column
    @Enumerated(EnumType.STRING)
    private TASK_STATUS status;

    @Column(length = 1024)
    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    @Range(min = 0, max = 100)
    @ColumnDefault(value = "0")
    private Integer progress;

    @Column(name = "ASSIGNED_USER_ID")
    private Integer assignedUserId;

    @Column(name = "PROJECT_ID", nullable = false)
    private Integer projectId;

    @Column
    private Integer optimisticEstimation;

    @Column
    private Integer modalEstimation;

    @Column
    private Integer pessimisticEstimation;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "TASK_ID", insertable = false, updatable = false, nullable = false, foreignKey = @ForeignKey(name = "FK_TASK_RELATIONSHIPS_TASK"))
    private Set<TaskRelationship> taskRelationships = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "RELATED_TASK_ID", insertable = false, updatable = false, nullable = false, foreignKey = @ForeignKey(name = "FK_TASK_RELATIONSHIPS_RELATED_TASK"))
    private Set<TaskRelationship> relatedTaskRelationships = new HashSet<>();

    public Task() {
    }

    public Task(String createdBy, String name, PRIORITY priority, TASK_STATUS status, String description, LocalDate startDate,
                LocalDate endDate, Integer progress, Integer assignedUserId, Integer projectId) {
        super(createdBy);
        this.name = name;
        this.priority = priority;
        this.status = status;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.progress = progress;
        this.assignedUserId = assignedUserId;
        this.projectId = projectId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public PRIORITY getPriority() {
        return priority;
    }

    public void setPriority(PRIORITY priority) {
        this.priority = priority;
    }

    public TASK_STATUS getStatus() {
        return status;
    }

    public void setStatus(TASK_STATUS status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public Integer getAssignedUserId() {
        return assignedUserId;
    }

    public void setAssignedUserId(Integer assignedUserId) {
        this.assignedUserId = assignedUserId;
    }

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public Integer getOptimisticEstimation() {
        return optimisticEstimation;
    }

    public void setOptimisticEstimation(Integer optimisticEstimation) {
        this.optimisticEstimation = optimisticEstimation;
    }

    public Integer getModalEstimation() {
        return modalEstimation;
    }

    public void setModalEstimation(Integer modalEstimation) {
        this.modalEstimation = modalEstimation;
    }

    public Integer getPessimisticEstimation() {
        return pessimisticEstimation;
    }

    public void setPessimisticEstimation(Integer pessimisticEstimation) {
        this.pessimisticEstimation = pessimisticEstimation;
    }

    public Set<TaskRelationship> getTaskRelationships() {
        return taskRelationships;
    }

    public void setTaskRelationships(Set<TaskRelationship> taskRelationships) {
        this.taskRelationships = taskRelationships;
    }

    public Set<TaskRelationship> getRelatedTaskRelationships() {
        return relatedTaskRelationships;
    }

    public void setRelatedTaskRelationships(Set<TaskRelationship> relatedTaskRelationships) {
        this.relatedTaskRelationships = relatedTaskRelationships;
    }

    @Override
    public TaskDto mapEntityToDTO(boolean fetchCollections) {
        return new TaskDto(
                this.getId(),
                this.name,
                this.priority,
                this.status,
                this.description,
                this.startDate,
                this.endDate,
                this.progress,
                this.assignedUserId,
                this.projectId,
                this.optimisticEstimation,
                this.modalEstimation,
                this.pessimisticEstimation,
                fetchCollections ?
                        relatedTaskRelationships.stream()
                                .filter(taskRelationship -> taskRelationship.getType() == TASK_RELATIONSHIP_TYPE.PREVIOUS_ACTIVITY)
                                .map(taskRelationship -> RelatedTaskDto.mapTaskRelationshipToRelatedTaskDto(taskRelationship, true))
                                .collect(Collectors.toList())
                        :
                        Collections.EMPTY_LIST,
                fetchCollections ?
                        taskRelationships.stream()
                                .filter(taskRelationship -> taskRelationship.getType() == TASK_RELATIONSHIP_TYPE.PREVIOUS_ACTIVITY)
                                .map(taskRelationship -> RelatedTaskDto.mapTaskRelationshipToRelatedTaskDto(taskRelationship, false))
                                .collect(Collectors.toList())
                        :
                        Collections.EMPTY_LIST
        );
    }
}
