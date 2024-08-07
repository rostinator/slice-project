package cz.uhk.projectmgmt.controller;

import cz.uhk.projectmgmt.dto.NotificationDto;
import cz.uhk.projectmgmt.dto.ProjectDto;
import cz.uhk.projectmgmt.dto.TaskDto;
import cz.uhk.projectmgmt.enums.PROJECT_ROLE;
import cz.uhk.projectmgmt.model.User;
import cz.uhk.projectmgmt.service.NotificationService;
import cz.uhk.projectmgmt.service.ProjectMemberService;
import cz.uhk.projectmgmt.service.ProjectService;
import cz.uhk.projectmgmt.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// https://github.com/saifaustcse/api-best-practices

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/v1/users")
public class UserController {

    private final ProjectService projectService;
    private final NotificationService notificationService;
    private final ProjectMemberService projectMemberService;
    private final TaskService taskService;

    public UserController(ProjectService projectService,
                          NotificationService notificationService,
                          ProjectMemberService projectMemberService,
                          TaskService taskService) {
        this.projectService = projectService;
        this.notificationService = notificationService;
        this.projectMemberService = projectMemberService;
        this.taskService = taskService;
    }

    @GetMapping("/{userId}/projects")
    public ResponseEntity<List<ProjectDto>> readAllUserProjects(@PathVariable Integer userId,
                                                                @AuthenticationPrincipal User authenticatedUser) {
        return ResponseEntity.ok(projectService.realAllUserProjects(userId, authenticatedUser));
    }

    @GetMapping("/{userId}/projects/{projectId}/role")
    public ResponseEntity<PROJECT_ROLE> readUserRoleInProject(@PathVariable Integer userId,
                                                              @PathVariable Integer projectId,
                                                              @AuthenticationPrincipal User authenticatedUser){
        return ResponseEntity.ok(projectMemberService.readUserRoleInProject(userId, projectId, authenticatedUser));
    }

    @GetMapping("/{userId}/notifications")
    public ResponseEntity<List<NotificationDto>> readUserNotifications(@PathVariable Integer userId,
                                                                       @AuthenticationPrincipal User authenticatedUser) {
        return ResponseEntity.ok(notificationService.readUserNotifications(userId, authenticatedUser));
    }

    @GetMapping("/{userId}/notifications/count")
    public ResponseEntity<Integer> readUnreadNotificationsCount(@PathVariable Integer userId,
                                                                @AuthenticationPrincipal User authenticatedUser) {
        return ResponseEntity.ok(notificationService.readUnreadNotificationsCountForUser(userId, authenticatedUser));
    }

    @PutMapping("/notifications/{notificationId}/mark-read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable Integer notificationId,
                                                    @AuthenticationPrincipal User authenticatedUser) {
        notificationService.markNotificationAsRead(notificationId, authenticatedUser);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/notifications/{notificationId}/resolve")
    public ResponseEntity<?> resolveNotification(@PathVariable Integer notificationId,
                                                 @RequestParam("confirmed") boolean confirmed,
                                                 @AuthenticationPrincipal User authenticatedUser) {
        notificationService.resolveNotification(notificationId, confirmed, authenticatedUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}/assigned-tasks")
    public ResponseEntity<List<TaskDto>> getAssignedTasks(@PathVariable Integer userId,
                                                          @AuthenticationPrincipal User authenticatedUser) {
        return ResponseEntity.ok(taskService.readUserAssignedTasks(userId, authenticatedUser));
    }

}
