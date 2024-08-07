package cz.uhk.projectmgmt.dto;

import cz.uhk.projectmgmt.enums.PRIORITY;
import cz.uhk.projectmgmt.enums.TASK_STATUS;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record CreateTaskDto(@NotBlank @Size(min = 1, max = 255) String name,
                            PRIORITY priority,
                            TASK_STATUS status,
                            LocalDate startDate,
                            LocalDate endDate,
                            @Positive @NotNull Integer projectId,
                            @Positive Integer assignedUserId,
                            List<Integer> previousActivities,
                            @Size(max = 1024) String description) {

    public CreateTaskDto(String name, PRIORITY priority, TASK_STATUS status, LocalDate startDate, LocalDate endDate,
                         Integer projectId, Integer assignedUserId, List<Integer> previousActivities, String description) {
        this.name = name;
        this.priority = priority;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.projectId = projectId;
        this.assignedUserId = assignedUserId;
        this.previousActivities = previousActivities;
        this.description = description;
    }

}
