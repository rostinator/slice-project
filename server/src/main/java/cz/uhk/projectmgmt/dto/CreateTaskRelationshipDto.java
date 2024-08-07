package cz.uhk.projectmgmt.dto;

import cz.uhk.projectmgmt.enums.TASK_RELATIONSHIP_TYPE;
import jakarta.validation.constraints.NotNull;

public record CreateTaskRelationshipDto(@NotNull Integer relatedTaskId,
                                        TASK_RELATIONSHIP_TYPE relationshipType) {

    public CreateTaskRelationshipDto(Integer relatedTaskId, TASK_RELATIONSHIP_TYPE relationshipType) {
        this.relatedTaskId = relatedTaskId;
        this.relationshipType = relationshipType;
    }

    @Override
    public Integer relatedTaskId() {
        return relatedTaskId;
    }
}
