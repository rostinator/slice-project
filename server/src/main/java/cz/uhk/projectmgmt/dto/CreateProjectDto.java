package cz.uhk.projectmgmt.dto;

import cz.uhk.projectmgmt.enums.PROJECT_STATUS;
import cz.uhk.projectmgmt.enums.PROJECT_TYPE;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateProjectDto(@NotBlank @Size(min = 5, max = 255) String name,
                               @NotNull PROJECT_TYPE type,
                               @Size(max = 1024) String description,
                               PROJECT_STATUS status) {

    public CreateProjectDto(String name, PROJECT_TYPE type, String description, PROJECT_STATUS status) {
        this.name = name;
        this.type = type;
        this.description = description;
        this.status = status;
    }
}
