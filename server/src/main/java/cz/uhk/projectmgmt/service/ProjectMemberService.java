package cz.uhk.projectmgmt.service;

import cz.uhk.projectmgmt.dto.CreateProjectMemberDto;
import cz.uhk.projectmgmt.dto.ProjectMemberDto;
import cz.uhk.projectmgmt.enums.NOTIFICATION_TYPE;
import cz.uhk.projectmgmt.enums.PROJECT_MEMBER_STATUS;
import cz.uhk.projectmgmt.enums.PROJECT_ROLE;
import cz.uhk.projectmgmt.enums.RIGHT;
import cz.uhk.projectmgmt.exception.BusinessValidationException;
import cz.uhk.projectmgmt.exception.DataNotFoundException;
import cz.uhk.projectmgmt.exception.NoPermissionException;
import cz.uhk.projectmgmt.model.Notification;
import cz.uhk.projectmgmt.model.Project;
import cz.uhk.projectmgmt.model.ProjectMember;
import cz.uhk.projectmgmt.model.User;
import cz.uhk.projectmgmt.repository.ProjectMemberRepository;
import cz.uhk.projectmgmt.repository.ProjectRepository;
import cz.uhk.projectmgmt.repository.UserRepository;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectMemberService {

    private final ProjectService projectService;
    private final NotificationService notificationService;

    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    private final MessageSource messageSource;

    public ProjectMemberService(ProjectService projectService,
                                NotificationService notificationService,
                                ProjectMemberRepository projectMemberRepository,
                                UserRepository userRepository,
                                ProjectRepository projectRepository,
                                MessageSource messageSource) {
        this.projectService = projectService;
        this.notificationService = notificationService;
        this.projectMemberRepository = projectMemberRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.messageSource = messageSource;
    }

    @Transactional(rollbackFor = Exception.class)
    public ProjectMemberDto createProjectMember(Integer projectId, CreateProjectMemberDto createProjectMemberDto, User userContext) {
        Project project = projectService.readProject(projectId);
        projectService.checkUserRightsOnProject(project, userContext, RIGHT.WRITE);

        Optional<User> userByEmailOpt = userRepository.findUserByEmail(createProjectMemberDto.email());
        if (!userByEmailOpt.isPresent())
            throw new BusinessValidationException("project.member.not.found", createProjectMemberDto.email());

        User user = userByEmailOpt.get();

        Optional<ProjectMember> projectMemberOpt = projectMemberRepository.readProjectMember(projectId, user.getId());
        if (projectMemberOpt.isPresent())
            throw new BusinessValidationException("project.member.already.exist", user.getUsername(), project.getName());

        Notification notification = notificationService.createAndSaveNotification(
                user.getId(),
                NOTIFICATION_TYPE.PROJECT_INVITATION,
                messageSource.getMessage(
                        "project.member.invitation.text",
                        new Object[]{userContext.getFullName(), project.getName()},
                        LocaleContextHolder.getLocale()
                ),
                userContext
        );

        ProjectMember projectMember = new ProjectMember(
                userContext.getUsername(),
                user,
                project,
                createProjectMemberDto.role(),
                PROJECT_MEMBER_STATUS.WAITING_FOR_CONFIRMATION,
                notification
        );

        projectMemberRepository.persist(projectMember);

        return projectMember.mapEntityToDTO();
    }

    @Transactional(rollbackFor = Exception.class)
    public List<ProjectMemberDto> readProjectMembers(Integer projectId, PROJECT_MEMBER_STATUS status, User userContext) {
        Project project = projectService.readProject(projectId);
        projectService.checkUserRightsOnProject(project, userContext, RIGHT.READ);

        return project.getProjectMembers()
                .stream()
                .filter(pm -> status == null || pm.getStatus() == status)
                .map(ProjectMember::mapEntityToDTO)
                .collect(Collectors.toList());
    }

    public void changeProjectMemberRole(Integer projectId, Integer userId, PROJECT_ROLE newRole, User userContext) {
        Project project = projectService.readProject(projectId);
        projectService.checkUserRightsOnProject(project, userContext, RIGHT.WRITE);

        Optional<ProjectMember> projectMemberOpt = projectMemberRepository.readProjectMember(projectId, userId);
        if (!projectMemberOpt.isPresent())
            throw new DataNotFoundException(ProjectMember.class, Map.of("projectId", Objects.toString(projectId), "userId", Objects.toString(userId)));

        ProjectMember projectMember = projectMemberOpt.get();

        // OK
        if (projectMember.getRole() == newRole)
            return;

        projectMember.setRole(newRole);
        projectMember.setUpdatedBy(userContext.getUsername());

        projectMemberRepository.merge(projectMember);
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteProjectMember(Integer projectId, Integer userId, User userContext) {
        Project project = projectService.readProject(projectId);
        projectService.checkUserRightsOnProject(project, userContext, RIGHT.WRITE);

        Optional<ProjectMember> projectMemberOpt = projectMemberRepository.readProjectMember(projectId, userId);
        if (!projectMemberOpt.isPresent())
            throw new DataNotFoundException(ProjectMember.class, Map.of("projectId", Objects.toString(projectId), "userId", Objects.toString(userId)));

        ProjectMember projectMember = projectMemberOpt.get();

        Notification notification = projectMember.getNotification();
        if (notification != null && !notification.isResolved())
            projectMemberRepository.remove(notification);

        projectMemberRepository.remove(projectMember);
    }

    public PROJECT_ROLE readUserRoleInProject(Integer userId, Integer projectId, User userContext) {
        if (userId != userContext.getId())
            throw new NoPermissionException(User.class, userContext.getUsername());

        return projectService.checkUserAccessToProject(
                projectService.readProject(projectId),
                userContext
        );
    }
}
