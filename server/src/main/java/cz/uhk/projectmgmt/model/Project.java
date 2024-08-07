package cz.uhk.projectmgmt.model;

import cz.uhk.projectmgmt.dto.ProjectDto;
import cz.uhk.projectmgmt.dto.ProjectMemberDto;
import cz.uhk.projectmgmt.enums.PROJECT_STATUS;
import cz.uhk.projectmgmt.enums.PROJECT_TYPE;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "PROJECTS")
public class Project extends EntityWithChanges implements EntityWithDTO<ProjectDto> {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PROJECT_TYPE type;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private PROJECT_STATUS status;

    @Column(length = 1024)
    private String description;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "PROJECT_ID", foreignKey = @ForeignKey(name = "FK_TASKS_PROJECTS"))
    @OrderBy("id")
    private Set<Task> tasks = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.REMOVE})
    @JoinColumn(name = "PROJECT_ID", insertable = false, updatable = false, nullable = false, foreignKey = @ForeignKey(name = "FK_PROJECT_MEMBERS_PROJECTS"))
    private Set<ProjectMember> projectMembers = new HashSet<>();

    public Project() {
    }

    public Project(String createdBy, String name, PROJECT_TYPE type, PROJECT_STATUS status, String description) {
        super(createdBy);
        this.name = name;
        this.type = type;
        this.status = status;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public PROJECT_TYPE getType() {
        return type;
    }

    public void setType(PROJECT_TYPE type) {
        this.type = type;
    }

    public PROJECT_STATUS getStatus() {
        return status;
    }

    public void setStatus(PROJECT_STATUS status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Task> getTasks() {
        return tasks;
    }

    public void setTasks(Set<Task> tasks) {
        this.tasks = tasks;
    }

    public Set<ProjectMember> getProjectMembers() {
        return projectMembers;
    }

    public void setProjectMembers(Set<ProjectMember> projectMembers) {
        this.projectMembers = projectMembers;
    }

    @Override
    public ProjectDto mapEntityToDTO(boolean fetchCollections) {
        return new ProjectDto(
                this.getId(),
                this.name,
                this.type,
                this.status,
                this.description,
                fetchCollections ?
                        this.tasks.stream().map(t -> t.mapEntityToDTO(true)).collect(Collectors.toList())
                        :
                        new ArrayList<>(),
                fetchCollections ?
                        this.projectMembers
                                .stream()
                                .map(pm -> new ProjectMemberDto(
                                                pm.getUser().getId(),
                                                pm.getUser().getFirstName(),
                                                pm.getUser().getLastName(),
                                                pm.getUser().getLastName(),
                                                pm.getRole(),
                                                pm.getStatus()
                                        )
                                )
                                .collect(Collectors.toList())
                        :
                        new ArrayList<>()
        );
    }
}
