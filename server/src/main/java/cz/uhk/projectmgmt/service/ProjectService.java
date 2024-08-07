package cz.uhk.projectmgmt.service;

import cz.uhk.projectmgmt.dto.CreateProjectDto;
import cz.uhk.projectmgmt.dto.ProjectDto;
import cz.uhk.projectmgmt.enums.*;
import cz.uhk.projectmgmt.exception.BusinessValidationException;
import cz.uhk.projectmgmt.exception.DataNotFoundException;
import cz.uhk.projectmgmt.exception.NoPermissionException;
import cz.uhk.projectmgmt.model.*;
import cz.uhk.projectmgmt.repository.ProjectMemberRepository;
import cz.uhk.projectmgmt.repository.ProjectRepository;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final MessageSource messageSource;

    public ProjectService(ProjectRepository projectRepository,
                          ProjectMemberRepository projectMemberRepository,
                          MessageSource messageSource) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.messageSource = messageSource;
    }

    public ProjectDto createNewProject(CreateProjectDto createProjectDto, User userCreated) {
        if (projectRepository.findUserProjectByName(createProjectDto.name(), userCreated.getId()).isPresent())
            throw new BusinessValidationException("project.name.already.exist", createProjectDto.name());

        Project project = new Project(
                userCreated.getUsername(),
                createProjectDto.name(),
                createProjectDto.type(),
                PROJECT_STATUS.NEW,
                createProjectDto.description()
        );

        project.setProjectMembers(
                Collections.singleton(
                        new ProjectMember(
                                userCreated.getUsername(),
                                userCreated,
                                project,
                                PROJECT_ROLE.OWNER,
                                PROJECT_MEMBER_STATUS.ACTIVE,
                                null
                        )
                )
        );

        projectRepository.persist(project);

        return project.mapEntityToDTO(false);
    }

    @Transactional(rollbackFor = Exception.class)
    public ProjectDto readProjectById(Integer projectId, User userContext) throws DataNotFoundException, NoPermissionException {
        Optional<Project> optionalProject = projectRepository.findById(projectId);

        if (!optionalProject.isPresent())
            throw new DataNotFoundException(Project.class, Map.of("id", Objects.toString(projectId)));

        Project project = optionalProject.get();

        checkUserRightsOnProject(project, userContext, RIGHT.READ);

        return project.mapEntityToDTO(true);
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateProject(Integer projectId, CreateProjectDto createProjectDto, User userContext) {
        Project project = readProject(projectId);

        checkUserRightsOnProject(project, userContext, RIGHT.WRITE);

        project.setName(createProjectDto.name());
        project.setDescription(createProjectDto.description());
        project.setStatus(createProjectDto.status());
        project.setType(createProjectDto.type());
        project.setUpdatedBy(userContext.getUsername());

        projectRepository.merge(project);
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteProject(Integer projectId, User userContext) {
        Project project = readProject(projectId);

        checkUserRightsOnProject(project, userContext, RIGHT.DELETE);

        projectRepository.remove(project);
    }

    public Project readProject(Integer projectId) {
        Optional<Project> projectOpt = projectRepository.findById(projectId);

        if (!projectOpt.isPresent())
            throw new DataNotFoundException(Project.class, Map.of("id", Objects.toString(projectId)));

        return projectOpt.get();
    }

    public PROJECT_ROLE checkUserAccessToProject(Project project, User userContext) {
        Optional<ProjectMember> projectMemberOpt = projectMemberRepository.readProjectMember(project.getId(), userContext.getId());
        if (!projectMemberOpt.isPresent())
            throw new DataNotFoundException(ProjectMember.class, Map.of("projectId", project.getId(), "userId", userContext.getId()));

        ProjectMember projectMember = projectMemberOpt.get();
        if (projectMember.getStatus() != PROJECT_MEMBER_STATUS.ACTIVE)
            throw new NoPermissionException(Project.class, userContext.getUsername());

        return projectMember.getRole();
    }

    public void checkUserRightsOnProject(Project project, User userContext, RIGHT right) {
        PROJECT_ROLE role = checkUserAccessToProject(project, userContext);

        switch (right) {
            case DELETE:
                if (role != PROJECT_ROLE.OWNER)
                    throw new NoPermissionException(Project.class, userContext.getUsername());
            case WRITE:
                if (!(role == PROJECT_ROLE.OWNER || role == PROJECT_ROLE.MANAGER))
                    throw new NoPermissionException(Project.class, userContext.getUsername());
                break;
            case READ:
                // OK
                break;
        }
    }

    public List<ProjectDto> realAllUserProjects(Integer userId, User userContext) {
        if (userId != userContext.getId())
            throw new NoPermissionException(User.class, userContext.getUsername());

        return projectRepository.readAllActiveUserProjects(userId)
                .stream()
                .map(project -> project.mapEntityToDTO(false))
                .collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class)
    public void createDemoProject(User newUser) {
        Project project = new Project(
                newUser.getUsername(),
                messageSource.getMessage("project.demo.name", null, Locale.getDefault()),
                PROJECT_TYPE.PRIVATE,
                PROJECT_STATUS.NEW,
                ""
        );

        project.setProjectMembers(
                Collections.singleton(
                        new ProjectMember(
                                newUser.getUsername(),
                                newUser,
                                project,
                                PROJECT_ROLE.OWNER,
                                PROJECT_MEMBER_STATUS.ACTIVE,
                                null
                        )
                )
        );

        projectRepository.persist(project);

        final LocalDate today = LocalDate.now();
        final Locale locale = LocaleContextHolder.getLocale();
        final int taskCount = 23;
        String[] taskNames = new String[taskCount];
        for (int i = 1; i < taskCount + 1; i++) {
            taskNames[i - 1] = messageSource.getMessage("task.demo.%d.name".formatted(i), null, locale);
        }

        int taskOrder = 0;

        // A
        Task taskA = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today, 3, project.getId(), 1, 2, 5);
        // B
        Task taskB = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(3), 4, project.getId(), 4, 4, 5);
        // C
        Task taskC = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(3), 2, project.getId(), 1, 1, 4);
        // E
        Task taskE = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(3), 5, project.getId(), 5, 5, 7);
        // F
        Task taskF = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(15), 5, project.getId(), 4, 6, 7);
        // G
        Task taskG = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(3), 3, project.getId(), 1, 4, 4);
        // H
        Task taskH = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(8), 7, project.getId(), 6, 8, 10);
        // I
        Task taskI = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(6), 6, project.getId(), 5, 7, 9);
        // J
        Task taskJ = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(15), 8, project.getId(), 8, 8, 10);
        // K
        Task taskK = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(24), 2, project.getId(), 1, 1, 2);
        // L
        Task taskL = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(23), 1, project.getId(), 1, 2, 2);
        // M
        Task taskM = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(12), 4, project.getId(), 4, 4, 6);
        // N
        Task taskN = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(16), 3, project.getId(), 2, 5, 7);
        // O
        Task taskO = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(26), 2, project.getId(), 1, 1, 2);
        // P
        Task taskP = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(28), 11, project.getId(), 9, 11, 13);
        // Q;
        Task taskQ = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(39), 7, project.getId(), 7, 9, 10);
        // R
        Task taskR = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(46), 1, project.getId(), 1, 1, 2);
        // S
        Task taskS = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(47), 2, project.getId(), 2, 2, 6);
        // T
        Task taskT = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(28), 10, project.getId(), 8, 11, 15);
        // U
        Task taskU = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(38), 8, project.getId(), 7, 9, 13);
        // V
        Task taskV = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(49), 4, project.getId(), 3, 5, 7);
        // X
        Task taskX = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(53), 3, project.getId(), 4, 4, 5);
        // Z
        Task taskZ = createAndSaveDemoTask(newUser.getUsername(), taskNames[taskOrder++], today.plusDays(24), 3, project.getId(), 2, 3, 7);


        createAndSaveTaskRelationship(taskB.getId(), taskA.getId());
        createAndSaveTaskRelationship(taskC.getId(), taskA.getId());
        createAndSaveTaskRelationship(taskE.getId(), taskA.getId());
        createAndSaveTaskRelationship(taskG.getId(), taskA.getId());

        createAndSaveTaskRelationship(taskJ.getId(), taskB.getId());
        createAndSaveTaskRelationship(taskJ.getId(), taskH.getId());

        createAndSaveTaskRelationship(taskH.getId(), taskC.getId());
        createAndSaveTaskRelationship(taskH.getId(), taskE.getId());
        createAndSaveTaskRelationship(taskH.getId(), taskG.getId());

        createAndSaveTaskRelationship(taskI.getId(), taskG.getId());

        createAndSaveTaskRelationship(taskF.getId(), taskH.getId());
        createAndSaveTaskRelationship(taskM.getId(), taskI.getId());
        createAndSaveTaskRelationship(taskL.getId(), taskJ.getId());
        createAndSaveTaskRelationship(taskK.getId(), taskL.getId());
        createAndSaveTaskRelationship(taskK.getId(), taskF.getId());
        createAndSaveTaskRelationship(taskK.getId(), taskN.getId());
        createAndSaveTaskRelationship(taskN.getId(), taskM.getId());

        createAndSaveTaskRelationship(taskZ.getId(), taskL.getId());
        createAndSaveTaskRelationship(taskO.getId(), taskK.getId());
        createAndSaveTaskRelationship(taskP.getId(), taskO.getId());
        createAndSaveTaskRelationship(taskT.getId(), taskO.getId());
        createAndSaveTaskRelationship(taskQ.getId(), taskP.getId());
        createAndSaveTaskRelationship(taskU.getId(), taskT.getId());
        createAndSaveTaskRelationship(taskS.getId(), taskU.getId());
        createAndSaveTaskRelationship(taskR.getId(), taskQ.getId());
        createAndSaveTaskRelationship(taskS.getId(), taskR.getId());
        createAndSaveTaskRelationship(taskV.getId(), taskS.getId());
        createAndSaveTaskRelationship(taskV.getId(), taskZ.getId());
        createAndSaveTaskRelationship(taskX.getId(), taskV.getId());
    }

    private Task createAndSaveDemoTask(String username, String name, LocalDate startDate, int duration, Integer projectId,
                                       Integer optimisticEstimation, Integer modalEstimation, Integer pessimisticEstimation) {
        Task task = new Task(
                username,
                name,
                CommonUtils.getRandomElement(PRIORITY.values()),
                CommonUtils.getRandomElement(new TASK_STATUS[]{TASK_STATUS.NEW, TASK_STATUS.WAITING, TASK_STATUS.ON_HOLD, TASK_STATUS.IN_PROGRESS}),
                null,
                startDate,
                startDate.plusDays(duration - 1),
                0,
                null,
                projectId
        );

        task.setOptimisticEstimation(optimisticEstimation);
        task.setModalEstimation(modalEstimation);
        task.setPessimisticEstimation(pessimisticEstimation);

        projectRepository.persist(task);
        return task;
    }

    private void createAndSaveTaskRelationship(Integer taskId, Integer relatedTaskId) {
        TaskRelationship taskRelationship = new TaskRelationship(
                taskId,
                relatedTaskId,
                TASK_RELATIONSHIP_TYPE.PREVIOUS_ACTIVITY
        );
        projectRepository.persist(taskRelationship);
    }

}
