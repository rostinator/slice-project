package cz.uhk.projectmgmt.dto;

import cz.uhk.projectmgmt.enums.PROJECT_ROLE;
import jakarta.validation.constraints.Email;
import org.springframework.lang.NonNull;

public record CreateProjectMemberDto(@NonNull PROJECT_ROLE role,
                                     @NonNull @Email String email) {

    public CreateProjectMemberDto(@NonNull PROJECT_ROLE role,
                                  @NonNull String email) {
        this.role = role;
        this.email = email;
    }
}
