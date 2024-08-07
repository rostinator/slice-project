package cz.uhk.projectmgmt.dto;

import cz.uhk.projectmgmt.enums.PROJECT_STATUS;
import cz.uhk.projectmgmt.enums.PROJECT_TYPE;

import java.util.List;

public final class ProjectDto {

    private Integer id;
    private String name;
    private PROJECT_TYPE type;
    private PROJECT_STATUS status;
    private String description;
    private List<TaskDto> tasks;
    private List<ProjectMemberDto> members;

    public ProjectDto(Integer id, String name, PROJECT_TYPE type, PROJECT_STATUS status,
                      String description, List<TaskDto> tasks, List<ProjectMemberDto> members) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.status = status;
        this.description = description;
        this.tasks = tasks;
        this.members = members;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public List<TaskDto> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskDto> tasks) {
        this.tasks = tasks;
    }

    public List<ProjectMemberDto> getMembers() {
        return members;
    }

    public void setMembers(List<ProjectMemberDto> members) {
        this.members = members;
    }
}
