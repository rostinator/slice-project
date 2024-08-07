package cz.uhk.projectmgmt.dto;

import cz.uhk.projectmgmt.enums.PROJECT_MEMBER_STATUS;
import cz.uhk.projectmgmt.enums.PROJECT_ROLE;

import java.time.LocalDateTime;

public class ProjectMemberDto {

    private final Integer userId;
    private final String firstName;
    private final String lastName;
    private final String email;
    private final LocalDateTime createdDateTime;
    private final LocalDateTime updatedDateTime;
    private final PROJECT_ROLE role;
    private final PROJECT_MEMBER_STATUS status;

    public ProjectMemberDto(Integer userId, String firstName, String lastName, String email, LocalDateTime createdDateTime, LocalDateTime updatedDateTime, PROJECT_ROLE role, PROJECT_MEMBER_STATUS status) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.createdDateTime = createdDateTime;
        this.updatedDateTime = updatedDateTime;
        this.role = role;
        this.status = status;
    }

    public ProjectMemberDto(Integer userId, String firstName, String lastName, String email, PROJECT_ROLE role, PROJECT_MEMBER_STATUS status) {
        this(userId, firstName, lastName, email, null, null, role, status);
    }

    public Integer getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getCreatedDateTime() {
        return createdDateTime;
    }

    public LocalDateTime getUpdatedDateTime() {
        return updatedDateTime;
    }

    public PROJECT_ROLE getRole() {
        return role;
    }

    public PROJECT_MEMBER_STATUS getStatus() {
        return status;
    }
}
