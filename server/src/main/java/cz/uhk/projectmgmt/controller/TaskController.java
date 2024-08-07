package cz.uhk.projectmgmt.controller;

import cz.uhk.projectmgmt.dto.*;
import cz.uhk.projectmgmt.enums.TASK_RELATIONSHIP_TYPE;
import cz.uhk.projectmgmt.model.User;
import cz.uhk.projectmgmt.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskDto> createTask(
            @RequestBody @Valid CreateTaskDto createTaskDto,
            @AuthenticationPrincipal User authenticatedUser) {
        return new ResponseEntity<>(
                taskService.createNewTask(createTaskDto, authenticatedUser),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskDto> getTask(
            @PathVariable Integer taskId,
            @AuthenticationPrincipal User authenticatedUser) {
        return new ResponseEntity<>(taskService.readTaskById(taskId, authenticatedUser), HttpStatus.OK);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable Integer taskId,
                                        @RequestBody @Valid UpdateTaskDto updateTaskDto,
                                        @AuthenticationPrincipal User authenticatedUser) {
        taskService.updateExistingTask(updateTaskDto, taskId, authenticatedUser);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Integer taskId,
                                        @AuthenticationPrincipal User authenticatedUser) {
        taskService.deleteTask(taskId, authenticatedUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{taskId}/not-related-tasks")
    public ResponseEntity<List<TaskDto>> getNotRelatedTasks(@PathVariable Integer taskId,
                                                            @AuthenticationPrincipal User authenticatedUser) {
        return new ResponseEntity<>(taskService.getNotRelatedTasks(taskId, authenticatedUser), HttpStatus.OK);
    }

    @GetMapping("/{taskId}/successor")
    public ResponseEntity<List<RelatedTaskDto>> getTaskSuccessor(@PathVariable Integer taskId,
                                                                 @AuthenticationPrincipal User authenticatedUser) {
        return new ResponseEntity<>(taskService.getTaskSuccessor(taskId, authenticatedUser), HttpStatus.OK);
    }

    @GetMapping("/{taskId}/predecessors")
    public ResponseEntity<List<RelatedTaskDto>> getTaskPredecessors(@PathVariable Integer taskId,
                                                                    @AuthenticationPrincipal User authenticatedUser) {
        return new ResponseEntity<>(taskService.getTaskPredecessors(taskId, authenticatedUser), HttpStatus.OK);
    }

    @PostMapping("/{taskId}/relationship")
    public ResponseEntity<RelatedTaskDto> createTaskRelationship(@PathVariable Integer taskId,
                                                                 @RequestBody @Valid CreateTaskRelationshipDto createTaskRelationshipDto,
                                                                 @AuthenticationPrincipal User authenticatedUser) {
        return new ResponseEntity<>(taskService.createTaskRelationship(taskId, createTaskRelationshipDto, authenticatedUser), HttpStatus.CREATED);
    }

    @PutMapping("/{taskId}/relationship/{relatedTaskId}")
    public ResponseEntity<?> updateTaskRelationship(@PathVariable Integer taskId,
                                                    @PathVariable Integer relatedTaskId,
                                                    @RequestParam("type") TASK_RELATIONSHIP_TYPE relationshipType,
                                                    @RequestBody UpdateTaskRelationshipDto updateTaskRelationshipDto,
                                                    @AuthenticationPrincipal User authenticatedUser) {
        taskService.updateTaskRelationship(taskId, relatedTaskId, updateTaskRelationshipDto, relationshipType, authenticatedUser);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{taskId}/relationship/{relatedTaskId}")
    public ResponseEntity<?> deleteTaskRelationship(@PathVariable Integer taskId,
                                                    @PathVariable Integer relatedTaskId,
                                                    @RequestParam("type") TASK_RELATIONSHIP_TYPE relationshipType,
                                                    @AuthenticationPrincipal User authenticatedUser) {
        taskService.deleteTaskRelationship(taskId, relatedTaskId, relationshipType, authenticatedUser);
        return ResponseEntity.noContent().build();
    }

}
