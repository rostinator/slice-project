package cz.uhk.projectmgmt.service;

import cz.uhk.projectmgmt.dto.*;
import cz.uhk.projectmgmt.enums.*;
import cz.uhk.projectmgmt.exception.BusinessValidationException;
import cz.uhk.projectmgmt.exception.DataNotFoundException;
import cz.uhk.projectmgmt.exception.NoPermissionException;
import cz.uhk.projectmgmt.model.*;
import cz.uhk.projectmgmt.repository.ProjectRepository;
import cz.uhk.projectmgmt.repository.TaskRepository;
import cz.uhk.projectmgmt.repository.UserRepository;
import jakarta.annotation.Nullable;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final ProjectService projectService;
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public TaskService(ProjectService projectService,
                       TaskRepository taskRepository,
                       ProjectRepository projectRepository,
                       UserRepository userRepository) {
        this.projectService = projectService;
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Transactional(rollbackFor = Exception.class)
    public TaskDto createNewTask(CreateTaskDto createTaskDto, User userContext) {
        User assignedUser = validTask(createTaskDto.name(), createTaskDto.projectId(), createTaskDto.assignedUserId(), null, userContext);

        Task task = new Task(
                userContext.getUsername(),
                createTaskDto.name(),
                createTaskDto.priority(),
                TASK_STATUS.NEW,
                createTaskDto.description(),
                createTaskDto.startDate(),
                createTaskDto.endDate(),
                0,
                assignedUser != null ? assignedUser.getId() : null,
                createTaskDto.projectId()
        );

        taskRepository.persist(task);

        if (!CollectionUtils.isEmpty(createTaskDto.previousActivities())) {
            for (Integer previousActivityId : createTaskDto.previousActivities()) {
                createAndSaveTaskRelationship(task, previousActivityId, TASK_RELATIONSHIP_TYPE.PREVIOUS_ACTIVITY);
            }
        }

        return task.mapEntityToDTO(false);
    }

    public TaskDto readTaskById(Integer taskId, User userContext) {
        TaskDto taskDto = checkUserAccessToTask(taskId, RIGHT.READ, userContext).mapEntityToDTO(false);

        taskDto.setTaskSuccessor(
                taskRepository.readTaskSuccessor(taskId).stream().map(RelatedTaskDto::mapTaskToRelatedTaskDto).collect(Collectors.toList())
        );
        taskDto.setTaskPredecessor(
                taskRepository.readTaskPredecessors(taskId).stream().map(RelatedTaskDto::mapTaskToRelatedTaskDto).collect(Collectors.toList())
        );

        return taskDto;
    }

    public List<TaskDto> readUserAssignedTasks(Integer userId, User userContext) {
        if (userId != userContext.getId())
            throw new NoPermissionException(User.class, userContext.getUsername());

        return taskRepository.readUserAssignedTasks(userId).stream().map(Task::mapEntityToDTO).collect(Collectors.toList());
    }

    public List<TaskDto> getNotRelatedTasks(Integer taskId, User userContext) {
        checkUserAccessToTask(taskId, RIGHT.READ, userContext);
        return taskRepository.readNotRelatedTasks(taskId).stream().map(Task::mapEntityToDTO).collect(Collectors.toList());
    }

    public List<RelatedTaskDto> getTaskSuccessor(Integer taskId, User userContext) {
        checkUserAccessToTask(taskId, RIGHT.READ, userContext);
        return taskRepository.readTaskSuccessor(taskId).stream().map(RelatedTaskDto::mapTaskToRelatedTaskDto).collect(Collectors.toList());
    }

    public List<RelatedTaskDto> getTaskPredecessors(Integer taskId, User userContext) {
        checkUserAccessToTask(taskId, RIGHT.READ, userContext);
        return taskRepository.readTaskPredecessors(taskId).stream().map(RelatedTaskDto::mapTaskToRelatedTaskDto).collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateExistingTask(UpdateTaskDto updateTaskDto, Integer taskId, User userContext) {
        Task task = checkUserAccessToTask(taskId, RIGHT.WRITE, userContext);

        User assignedUser = validTask(
                updateTaskDto.name(),
                task.getProjectId(),
                updateTaskDto.assignedUserId(),
                task,
                userContext
        );

        task.setName(updateTaskDto.name());
        task.setPriority(updateTaskDto.priority());
        task.setStatus(updateTaskDto.status());
        task.setDescription(StringUtils.isBlank(updateTaskDto.description()) ? null : updateTaskDto.description());
        task.setStartDate(updateTaskDto.startDate());
        task.setEndDate(updateTaskDto.endDate());
        if (updateTaskDto.progress() != null)
            task.setProgress(updateTaskDto.progress());
        task.setAssignedUserId(assignedUser != null ? assignedUser.getId() : null);
        task.setOptimisticEstimation(updateTaskDto.optimisticEstimation());
        task.setModalEstimation(updateTaskDto.modalEstimation());
        task.setPessimisticEstimation(updateTaskDto.pessimisticEstimation());

        task.setUpdatedBy(userContext.getUsername());

        if (task.getStartDate().isAfter(task.getEndDate()))
            throw new BusinessValidationException("task.invalid.start.end.date", task.getStartDate(), task.getEndDate());

        if (task.getOptimisticEstimation() != null && task.getModalEstimation() != null && task.getPessimisticEstimation() != null
                && !(0 <= task.getOptimisticEstimation()
                && task.getOptimisticEstimation() <= task.getModalEstimation()
                && task.getModalEstimation() <= task.getModalEstimation())) {
            throw new BusinessValidationException("task.invalid.estimations");
        }

        taskRepository.merge(task);
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteTask(Integer taskId, User userContext) {
        Task task = checkUserAccessToTask(taskId, RIGHT.DELETE, userContext);

        taskRepository.remove(task);
    }

    public RelatedTaskDto createTaskRelationship(Integer taskId, CreateTaskRelationshipDto createTaskRelationshipDto, User userContext) {
        Task task = checkUserAccessToTask(taskId, RIGHT.READ, userContext);
        Task relatedTask = checkUserAccessToTask(createTaskRelationshipDto.relatedTaskId(), RIGHT.READ, userContext);

        if (task.getProjectId() != relatedTask.getProjectId())
            throw new BusinessValidationException("task.relationship.not.same.project", task.getName(), relatedTask.getName());

        Optional<TaskRelationship> existTaskRelationshipOpt = taskRepository.findTaskRelationship(
                taskId, createTaskRelationshipDto.relatedTaskId(), createTaskRelationshipDto.relationshipType()
        );

        if (existTaskRelationshipOpt.isPresent())
            throw new BusinessValidationException("task.relationship.already.exist", task.getName(), relatedTask.getName());

        createAndSaveTaskRelationship(task, createTaskRelationshipDto.relatedTaskId(), createTaskRelationshipDto.relationshipType());

        return RelatedTaskDto.mapTaskToRelatedTaskDto(relatedTask);
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateTaskRelationship(Integer taskId, Integer relatedTaskId, UpdateTaskRelationshipDto updateTaskRelationshipDto, TASK_RELATIONSHIP_TYPE relationshipType, User userContext) {
        checkUserAccessToTask(taskId, RIGHT.WRITE, userContext);
        Optional<TaskRelationship> taskRelationshipOpt = taskRepository.findTaskRelationship(
                taskId, relatedTaskId, relationshipType
        );

        if (!taskRelationshipOpt.isPresent())
            throw new DataNotFoundException(
                    TaskRelationship.class,
                    Map.of("taskId", taskId, "relatedTaskId", relatedTaskId, "relationshipType", relationshipType)
            );

        TaskRelationship taskRelationship = taskRelationshipOpt.get();

        taskRelationship.setMinimumTimeGap(updateTaskRelationshipDto.minimumTimeGap());
        taskRelationship.setMaximumTimeGap(updateTaskRelationshipDto.maximumTimeGap());

        taskRepository.merge(taskRelationship);
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteTaskRelationship(Integer taskId, Integer relatedTaskId, TASK_RELATIONSHIP_TYPE relationshipType, User userContext) {
        checkUserAccessToTask(taskId, RIGHT.DELETE, userContext);

        Optional<TaskRelationship> taskRelationshipOpt = taskRepository.findTaskRelationship(
                taskId, relatedTaskId, relationshipType
        );

        if (!taskRelationshipOpt.isPresent())
            throw new DataNotFoundException(
                    TaskRelationship.class,
                    Map.of("taskId", taskId, "relatedTaskId", relatedTaskId, "relationshipType", relationshipType)
            );

        taskRepository.remove(taskRelationshipOpt.get());
    }

    private User validTask(String name, Integer projectId, Integer assignedUserId, @Nullable Task existTask, User userContext) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);
        if (!projectOpt.isPresent())
            throw new DataNotFoundException(Project.class, Map.of("id", projectId));

        Project project = projectOpt.get();

        PROJECT_ROLE role = projectService.checkUserAccessToProject(project, userContext);

        if (!(role == PROJECT_ROLE.OWNER || role == PROJECT_ROLE.MANAGER || (existTask != null && existTask.getAssignedUserId() != userContext.getId())))
            throw new NoPermissionException(Task.class, userContext.getUsername());

        Optional<Task> taskWithSameNameOpt = taskRepository.findTaskByNameInProject(name, project.getId());
        if (taskWithSameNameOpt.isPresent() && !taskWithSameNameOpt.get().equals(existTask))
            throw new BusinessValidationException("task.name.already.exist", name);

        User assignedUser = null;
        if (assignedUserId != null) {
            if (assignedUserId == userContext.getId()) {
                assignedUser = userContext;
            } else {
                if (project.getType() != PROJECT_TYPE.PUBLIC)
                    throw new BusinessValidationException("project.not.public", project.getName());

                Optional<User> assignedUserOpt = userRepository.findById(assignedUserId);
                if (!assignedUserOpt.isPresent())
                    throw new DataNotFoundException(User.class, Map.of("id", assignedUserId));

                Optional<ProjectMember> projectMember = project.getProjectMembers()
                        .stream()
                        .filter(pm -> pm.getRole() != PROJECT_ROLE.READER && pm.getUser().equals(assignedUserOpt.get()))
                        .findFirst();

                assignedUser = assignedUserOpt.get();

                if (!projectMember.isPresent())
                    throw new BusinessValidationException("task.assigned.user.not.project.member", assignedUser.getUsername(), project.getName());

            }
        }

        return assignedUser;
    }

    private Task checkUserAccessToTask(Integer taskId, RIGHT right, User userContext) {
        Optional<Task> optionalTask = taskRepository.findById(taskId);

        if (!optionalTask.isPresent())
            throw new DataNotFoundException(Task.class, Map.of("id", Objects.toString(taskId)));

        Task task = optionalTask.get();

        PROJECT_ROLE role = projectService.checkUserAccessToProject(
                projectService.readProject(task.getProjectId()),
                userContext
        );

        if (right == RIGHT.WRITE && !(role == PROJECT_ROLE.OWNER || role == PROJECT_ROLE.MANAGER || task.getAssignedUserId() == userContext.getId()))
            throw new NoPermissionException(Task.class, userContext.getUsername());

        if (right == RIGHT.DELETE && role != PROJECT_ROLE.OWNER && role != PROJECT_ROLE.MANAGER)
            throw new NoPermissionException(Task.class, userContext.getUsername());

        return task;
    }

    private void createAndSaveTaskRelationship(Task task, Integer relatedTaskId, TASK_RELATIONSHIP_TYPE type) {
        Optional<Task> relatedTaskOpt = taskRepository.findById(relatedTaskId);
        if (!relatedTaskOpt.isPresent())
            throw new DataNotFoundException(Task.class, Map.of("id", relatedTaskId));

        Task previousTask = relatedTaskOpt.get();
        if (previousTask.getProjectId() != task.getProjectId())
            throw new BusinessValidationException("task.relationship.not.same.project", task.getName(), previousTask.getName());

        TaskRelationship taskRelationship = new TaskRelationship(
                task.getId(),
                previousTask.getId(),
                type
        );

        taskRepository.persist(taskRelationship);
    }
}
