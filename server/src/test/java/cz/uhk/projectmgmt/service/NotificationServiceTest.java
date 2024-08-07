package cz.uhk.projectmgmt.service;

import cz.uhk.projectmgmt.dto.NotificationDto;
import cz.uhk.projectmgmt.enums.NOTIFICATION_TYPE;
import cz.uhk.projectmgmt.enums.PROJECT_MEMBER_STATUS;
import cz.uhk.projectmgmt.enums.PROJECT_ROLE;
import cz.uhk.projectmgmt.model.Notification;
import cz.uhk.projectmgmt.model.ProjectMember;
import cz.uhk.projectmgmt.model.User;
import cz.uhk.projectmgmt.repository.NotificationRepository;
import cz.uhk.projectmgmt.repository.ProjectMemberRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private ProjectMemberRepository projectMemberRepository;

    @InjectMocks
    private NotificationService notificationService;

    private static final User TEST_USER = new User("tester", "Ivan", "Tester", "test@test.com", "", "");

    @Test
    void readUserNotificationsTest() {
        final Integer userId = 1;
        TEST_USER.setId(userId);

        Notification notification = new Notification(
                TEST_USER.getUsername(),
                TEST_USER.getId(),
                false,
                NOTIFICATION_TYPE.PROJECT_INVITATION,
                "TEST"
        );

        given(notificationRepository.readUserNotifications(userId))
                .willReturn(Collections.singletonList(notification));

        List<NotificationDto> notifications = notificationService.readUserNotifications(userId, TEST_USER);

        assertThat(notifications).isNotEmpty();
        assertThat(notifications.size()).isEqualTo(1);
    }

    @Test
    void readUnreadNotificationsCountForUserTest() {
        final Integer userId = 1;
        TEST_USER.setId(userId);

        given(notificationRepository.readUnreadNotificationsCount(userId))
                .willReturn(25);

        Integer unreadNotificationsCount = notificationService.readUnreadNotificationsCountForUser(userId, TEST_USER);
        assertThat(unreadNotificationsCount).isEqualTo(25);
    }

    @Test
    void markNotificationAsReadTest() {
        final Integer userId = 1;
        final Integer notificationId = 1;
        TEST_USER.setId(userId);
        final Notification notification = new Notification(
                TEST_USER.getUsername(),
                TEST_USER.getId(),
                true,
                NOTIFICATION_TYPE.PROJECT_INVITATION,
                "TEST"
        );

        given(notificationRepository.findById(notificationId))
                .willReturn(Optional.of(notification));

        notificationService.markNotificationAsRead(notificationId, TEST_USER);

        assertThat(notification.isUnread()).isFalse();
    }

    @Test
    void createAndSaveNotificationTest() {
        Integer userId = 1;
        TEST_USER.setId(userId);
        NOTIFICATION_TYPE notificationType = NOTIFICATION_TYPE.PROJECT_INVITATION;
        String content = "This is test";

        given(notificationRepository.persist(any())).willAnswer(i -> i.getArguments()[0]);

        Notification notification = notificationService.createAndSaveNotification(userId, notificationType, content, TEST_USER);

        assertThat(notification).isNotNull();
        assertThat(notification.getUserId()).isEqualTo(userId);
        assertThat(notification.getType()).isEqualTo(notificationType);
        assertThat(notification.getContent()).isEqualTo(content);
        assertThat(notification.isResolved()).isFalse();
        assertThat(notification.isUnread()).isTrue();
    }

    @Test
    void resolveNotificationTest() {
        final Integer userId = 1;
        final Integer notificationId = 1;
        TEST_USER.setId(userId);

        final Notification notification = new Notification(
                TEST_USER.getUsername(),
                TEST_USER.getId(),
                true,
                NOTIFICATION_TYPE.PROJECT_INVITATION,
                "TEST"
        );
        notification.setId(notificationId);

        given(notificationRepository.findById(notificationId))
                .willReturn(Optional.of(notification));

        given(projectMemberRepository.readProjectMemberForNotification(notificationId))
                .willReturn(Optional.of(new ProjectMember("", TEST_USER, null, PROJECT_ROLE.MEMBER, PROJECT_MEMBER_STATUS.WAITING_FOR_CONFIRMATION, null)));

        notificationService.resolveNotification(notificationId, true, TEST_USER);


        assertThat(notification.isResolved()).isTrue();
    }
}