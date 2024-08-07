package cz.uhk.projectmgmt.service;

import cz.uhk.projectmgmt.dto.CreateProjectMemberDto;
import cz.uhk.projectmgmt.dto.ProjectMemberDto;
import cz.uhk.projectmgmt.enums.PROJECT_MEMBER_STATUS;
import cz.uhk.projectmgmt.enums.PROJECT_ROLE;
import cz.uhk.projectmgmt.model.Notification;
import cz.uhk.projectmgmt.model.Project;
import cz.uhk.projectmgmt.model.ProjectMember;
import cz.uhk.projectmgmt.model.User;
import cz.uhk.projectmgmt.repository.ProjectMemberRepository;
import cz.uhk.projectmgmt.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.MessageSource;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class ProjectMemberServiceTest {

    @Mock
    private ProjectService projectService;

    @Mock
    private ProjectMemberRepository projectMemberRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private ProjectMemberService projectMemberService;

    private static final User TEST_USER = new User("tester", "Ivan", "Tester", "test@test.com", "", "");

    @Test
    void createProjectMemberTest() {
        final Integer userId = 1;
        final Integer projectId = 1;
        final String email = "test@test.com";
        TEST_USER.setId(userId);

        CreateProjectMemberDto createProjectMemberDto = new CreateProjectMemberDto(PROJECT_ROLE.READER, email);

        Project project = new Project();
        project.setId(projectId);

        given(projectService.readProject(projectId)).willReturn(project);
        given(userRepository.findUserByEmail(email)).willReturn(Optional.of(TEST_USER));
        given(projectMemberRepository.readProjectMember(projectId, userId)).willReturn(Optional.empty());
        given(notificationService.createAndSaveNotification(any(), any(), any(), any())).willReturn(new Notification());

        ProjectMemberDto projectMember = projectMemberService.createProjectMember(projectId, createProjectMemberDto, TEST_USER);

        assertThat(projectMember.getStatus()).isEqualTo(PROJECT_MEMBER_STATUS.WAITING_FOR_CONFIRMATION);
        assertThat(projectMember.getRole()).isEqualTo(PROJECT_ROLE.READER);
    }

    @Test
    void readProjectMembersTest() {
        final Integer userId = 1;
        final Integer projectId = 1;
        TEST_USER.setId(userId);

        Project project = new Project();
        project.setId(projectId);
        ProjectMember projectMember1 = new ProjectMember();
        projectMember1.setUser(new User());
        projectMember1.setStatus(PROJECT_MEMBER_STATUS.ACTIVE);
        ProjectMember projectMember2 = new ProjectMember();
        projectMember2.setUser(new User());
        projectMember2.setStatus(PROJECT_MEMBER_STATUS.USER_LEFT_TEAM);

        project.setProjectMembers(new HashSet<>(Arrays.asList(projectMember1, projectMember2)));

        given(projectService.readProject(projectId)).willReturn(project);

        List<ProjectMemberDto> projectMemberDtos = projectMemberService.readProjectMembers(projectId, PROJECT_MEMBER_STATUS.ACTIVE, TEST_USER);
        assertThat(projectMemberDtos).isNotEmpty();
        assertThat(projectMemberDtos.size()).isEqualTo(1);
    }

    @Test
    void changeProjectMemberRoleTest() {
        final Integer userId = 1;
        final Integer projectId = 1;
        TEST_USER.setId(userId);

        Project project = new Project();
        project.setId(projectId);
        ProjectMember projectMember = new ProjectMember();

        given(projectService.readProject(projectId)).willReturn(project);
        given(projectMemberRepository.readProjectMember(projectId, userId))
                .willReturn(Optional.of(projectMember));
        given(projectMemberRepository.merge(any())).willAnswer(i -> i.getArguments()[0]);

        projectMemberService.changeProjectMemberRole(projectId, userId, PROJECT_ROLE.OWNER, TEST_USER);

        assertThat(projectMember.getRole()).isEqualTo(PROJECT_ROLE.OWNER);
    }

    @Test
    void deleteProjectMemberTest() {
        final Integer userId = 1;
        final Integer projectId = 1;
        TEST_USER.setId(userId);

        Project project = new Project();
        project.setId(projectId);
        given(projectService.readProject(projectId)).willReturn(project);
        given(projectMemberRepository.readProjectMember(projectId, userId))
                .willReturn(Optional.of(new ProjectMember()));

        projectMemberService.deleteProjectMember(projectId, userId, TEST_USER);
    }

    @Test
    void readUserRoleInProjectTest() {
        final Integer userId = 1;
        final Integer projectId = 1;
        TEST_USER.setId(userId);

        Project project = new Project();
        project.setId(projectId);

        given(projectService.readProject(projectId)).willReturn(project);
        given(projectService.checkUserAccessToProject(project, TEST_USER)).willReturn(PROJECT_ROLE.MEMBER);

        PROJECT_ROLE projectRole = projectMemberService.readUserRoleInProject(userId, projectId, TEST_USER);

        assertThat(projectRole).isEqualTo(PROJECT_ROLE.MEMBER);
    }
}