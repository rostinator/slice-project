package cz.uhk.projectmgmt.controller;

import cz.uhk.projectmgmt.dto.*;
import cz.uhk.projectmgmt.enums.PROJECT_MEMBER_STATUS;
import cz.uhk.projectmgmt.model.User;
import cz.uhk.projectmgmt.service.ProjectMemberService;
import cz.uhk.projectmgmt.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectMemberService projectMemberService;

    public ProjectController(ProjectService projectService,
                             ProjectMemberService projectMemberService) {
        this.projectService = projectService;
        this.projectMemberService = projectMemberService;
    }

    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody @Valid CreateProjectDto createProjectDto,
                                                    @AuthenticationPrincipal User authenticatedUser) {
        return new ResponseEntity<>(projectService.createNewProject(createProjectDto, authenticatedUser), HttpStatus.CREATED);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDto> readProject(@PathVariable Integer projectId,
                                                  @AuthenticationPrincipal User authenticatedUser) {
        return new ResponseEntity<>(projectService.readProjectById(projectId, authenticatedUser), HttpStatus.OK);
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<?> updateProject(@PathVariable Integer projectId,
                                           @RequestBody @Valid CreateProjectDto createProjectDto,
                                           @AuthenticationPrincipal User authenticatedUser) {
        projectService.updateProject(projectId, createProjectDto, authenticatedUser);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(@PathVariable Integer projectId,
                                           @AuthenticationPrincipal User authenticatedUser) {
        projectService.deleteProject(projectId, authenticatedUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{projectId}/name")
    public ResponseEntity<String> getProjectName(@PathVariable Integer projectId,
                                                 @AuthenticationPrincipal User authenticatedUser) {
        return new ResponseEntity<>(projectService.readProjectById(projectId, authenticatedUser).getName(), HttpStatus.OK);
    }

    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<ProjectMemberDto>> getProjectMembers(@PathVariable Integer projectId,
                                                                    @RequestParam(name = "status", required = false) PROJECT_MEMBER_STATUS status,
                                                                    @AuthenticationPrincipal User authenticatedUser) {
        return new ResponseEntity<>(projectMemberService.readProjectMembers(projectId, status, authenticatedUser), HttpStatus.OK);
    }

    @PostMapping("/{projectId}/members")
    public ResponseEntity<ProjectMemberDto> createProjectMember(@PathVariable Integer projectId,
                                                                @RequestBody @Valid CreateProjectMemberDto createProjectMemberDto,
                                                                @AuthenticationPrincipal User authenticatedUser) {
        return new ResponseEntity<>(projectMemberService.createProjectMember(projectId, createProjectMemberDto, authenticatedUser), HttpStatus.CREATED);
    }

    @PutMapping("/{projectId}/members/{userId}")
    public ResponseEntity<?> updateMemberRole(@PathVariable Integer projectId,
                                              @PathVariable Integer userId,
                                              @RequestBody @Valid ChangeProjectMemberRoleDto changeProjectMemberRoleDto,
                                              @AuthenticationPrincipal User authenticatedUser) {
        projectMemberService.changeProjectMemberRole(projectId, userId, changeProjectMemberRoleDto.getNewRole(), authenticatedUser);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<?> deleteProjectMember(@PathVariable Integer projectId,
                                                 @PathVariable Integer userId,
                                                 @AuthenticationPrincipal User authenticatedUser) {
        projectMemberService.deleteProjectMember(projectId, userId, authenticatedUser);
        return ResponseEntity.noContent().build();
    }

}
