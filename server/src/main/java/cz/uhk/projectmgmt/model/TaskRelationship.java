package cz.uhk.projectmgmt.model;

import cz.uhk.projectmgmt.enums.TASK_RELATIONSHIP_TYPE;
import jakarta.persistence.*;

@Entity
@Table(
        name = "TASK_RELATIONSHIPS",
        uniqueConstraints = @UniqueConstraint(columnNames = {"TASK_ID", "RELATED_TASK_ID", "TYPE"}, name = "TASK_RELATIONSHIPS_TYPE_UC")
)
public class TaskRelationship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "TASK_ID", nullable = false)
    private Integer taskId;

    @Column(name = "RELATED_TASK_ID", nullable = false)
    private Integer relatedTaskId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TASK_RELATIONSHIP_TYPE type;

    @Column
    private Integer minimumTimeGap;

    @Column
    private Integer maximumTimeGap;

    public TaskRelationship() {
    }

    public TaskRelationship(Integer taskId, Integer relatedTaskId, TASK_RELATIONSHIP_TYPE type) {
        this.taskId = taskId;
        this.relatedTaskId = relatedTaskId;
        this.type = type;
    }

    public Integer getId() {
        return id;
    }

    public Integer getTaskId() {
        return taskId;
    }

    public Integer getRelatedTaskId() {
        return relatedTaskId;
    }

    public TASK_RELATIONSHIP_TYPE getType() {
        return type;
    }

    public Integer getMinimumTimeGap() {
        return minimumTimeGap;
    }

    public void setMinimumTimeGap(Integer minimumTimeGap) {
        this.minimumTimeGap = minimumTimeGap;
    }

    public Integer getMaximumTimeGap() {
        return maximumTimeGap;
    }

    public void setMaximumTimeGap(Integer maximumTimeGap) {
        this.maximumTimeGap = maximumTimeGap;
    }
}
