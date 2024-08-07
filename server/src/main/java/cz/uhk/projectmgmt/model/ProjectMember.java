package cz.uhk.projectmgmt.model;

import cz.uhk.projectmgmt.dto.ProjectMemberDto;
import cz.uhk.projectmgmt.enums.PROJECT_MEMBER_STATUS;
import cz.uhk.projectmgmt.enums.PROJECT_ROLE;
import jakarta.persistence.*;

@Entity
@Table(
        name = "PROJECT_MEMBERS",
        uniqueConstraints = @UniqueConstraint(columnNames = {"USER_ID", "PROJECT_ID"}, name = "PROJECT_MEMBER_UC")
)
public class ProjectMember extends EntityWithChanges implements EntityWithDTO<ProjectMemberDto> {

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Project project;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PROJECT_ROLE role;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PROJECT_MEMBER_STATUS status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "NOTIFICATION_ID", foreignKey = @ForeignKey(name = "FK_PROJECT_MEMBERS_NOTIFICATIONS"))
    private Notification notification;

    public ProjectMember() {

    }

    public ProjectMember(String createdBy, User user, Project project, PROJECT_ROLE role, PROJECT_MEMBER_STATUS status, Notification notification) {
        super(createdBy);
        this.user = user;
        this.project = project;
        this.role = role;
        this.status = status;
        this.notification = notification;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public PROJECT_ROLE getRole() {
        return role;
    }

    public void setRole(PROJECT_ROLE role) {
        this.role = role;
    }

    public PROJECT_MEMBER_STATUS getStatus() {
        return status;
    }

    public void setStatus(PROJECT_MEMBER_STATUS status) {
        this.status = status;
    }

    public Notification getNotification() {
        return notification;
    }

    public void setNotification(Notification notification) {
        this.notification = notification;
    }

    @Override
    public ProjectMemberDto mapEntityToDTO(boolean fetchCollections) {
        return new ProjectMemberDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                getCreatedOn(),
                getUpdatedOn(),
                role,
                status
        );
    }
}
