package cz.uhk.projectmgmt.dto;

import cz.uhk.projectmgmt.enums.PRIORITY;
import cz.uhk.projectmgmt.enums.TASK_STATUS;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateTaskDto(String name,
                            PRIORITY priority,
                            TASK_STATUS status,
                            LocalDate startDate,
                            LocalDate endDate,
                            Integer progress,
                            Integer assignedUserId,
                            @Size(max = 1024) String description,
                            Integer optimisticEstimation,
                            Integer modalEstimation,
                            Integer pessimisticEstimation) {

    public UpdateTaskDto(String name, PRIORITY priority, TASK_STATUS status, LocalDate startDate, LocalDate endDate,
                         Integer progress, Integer assignedUserId, String description, Integer optimisticEstimation,
                         Integer modalEstimation, Integer pessimisticEstimation) {
        this.name = name;
        this.priority = priority;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.progress = progress;
        this.assignedUserId = assignedUserId;
        this.description = description;
        this.optimisticEstimation = optimisticEstimation;
        this.modalEstimation = modalEstimation;
        this.pessimisticEstimation = pessimisticEstimation;
    }
}
