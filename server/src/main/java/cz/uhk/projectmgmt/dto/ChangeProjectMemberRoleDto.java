package cz.uhk.projectmgmt.dto;

import cz.uhk.projectmgmt.enums.PROJECT_ROLE;
import jakarta.validation.constraints.NotNull;

public class ChangeProjectMemberRoleDto {

    @NotNull
    private PROJECT_ROLE newRole;

    public ChangeProjectMemberRoleDto() {
    }

    public ChangeProjectMemberRoleDto(PROJECT_ROLE newRole) {
        this.newRole = newRole;
    }

    public void setNewRole(PROJECT_ROLE newRole) {
        this.newRole = newRole;
    }

    public PROJECT_ROLE getNewRole() {
        return newRole;
    }
}
