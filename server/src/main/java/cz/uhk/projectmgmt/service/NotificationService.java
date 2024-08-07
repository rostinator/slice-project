package cz.uhk.projectmgmt.service;

import cz.uhk.projectmgmt.dto.NotificationDto;
import cz.uhk.projectmgmt.enums.NOTIFICATION_TYPE;
import cz.uhk.projectmgmt.enums.PROJECT_MEMBER_STATUS;
import cz.uhk.projectmgmt.exception.BusinessValidationException;
import cz.uhk.projectmgmt.exception.DataNotFoundException;
import cz.uhk.projectmgmt.exception.NoPermissionException;
import cz.uhk.projectmgmt.model.Notification;
import cz.uhk.projectmgmt.model.ProjectMember;
import cz.uhk.projectmgmt.model.User;
import cz.uhk.projectmgmt.repository.NotificationRepository;
import cz.uhk.projectmgmt.repository.ProjectMemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final ProjectMemberRepository projectMemberRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               ProjectMemberRepository projectMemberRepository) {
        this.notificationRepository = notificationRepository;
        this.projectMemberRepository = projectMemberRepository;
    }

    public List<NotificationDto> readUserNotifications(Integer userId, User userContext) {
        if (userId != userContext.getId())
            throw new NoPermissionException(Notification.class, userContext.getUsername());

        return notificationRepository.readUserNotifications(userId)
                .stream()
                .map(Notification::mapEntityToDTO)
                .collect(Collectors.toList());
    }

    public Integer readUnreadNotificationsCountForUser(Integer userId, User userContext) {
        if (userId != userContext.getId())
            throw new NoPermissionException(Notification.class, userContext.getUsername());

        return notificationRepository.readUnreadNotificationsCount(userId);
    }

    @Transactional(rollbackFor = Exception.class)
    public void markNotificationAsRead(Integer notificationId, User userContext) {
        Notification notification = checkUserAccessToNotification(notificationId, userContext);

        if (!notification.isUnread())
            throw new BusinessValidationException("user.notification.already.read", notificationId);

        notification.setUnread(false);
        notification.setUpdatedBy(userContext.getUsername());

        notificationRepository.merge(notification);
    }

    public Notification createAndSaveNotification(Integer userId, NOTIFICATION_TYPE type, String content, User userContext) {
        Notification notification = new Notification(userContext.getUsername(), userId, true, type, content);

        return notificationRepository.persist(notification);
    }

    @Transactional(rollbackFor = Exception.class)
    public void resolveNotification(Integer notificationId, boolean confirmed, User userContext) {
        Notification notification = checkUserAccessToNotification(notificationId, userContext);

        if (notification.isResolved())
            throw new BusinessValidationException("user.notification.already.resolved", notificationId);

        switch (notification.getType()) {
            case PROJECT_INVITATION -> {
                Optional<ProjectMember> projectMemberOpt = projectMemberRepository.readProjectMemberForNotification(notification.getId());
                if (!projectMemberOpt.isPresent())
                    throw new DataNotFoundException(ProjectMember.class, Map.of("notificationId", notification.getId()));

                ProjectMember projectMember = projectMemberOpt.get();
                if (projectMember.getStatus() != PROJECT_MEMBER_STATUS.WAITING_FOR_CONFIRMATION)
                    throw new BusinessValidationException("project.member.invitation.invalid.status", projectMember.getStatus());

                projectMember.setStatus(confirmed ? PROJECT_MEMBER_STATUS.ACTIVE : PROJECT_MEMBER_STATUS.CONFIRMATION_REJECTED);

                projectMemberRepository.merge(projectMember);

                notification.setResolved(true);
                notification.setUpdatedBy(userContext.getUsername());
                notificationRepository.merge(notification);
            }
        }
    }

    private Notification checkUserAccessToNotification(Integer notificationId, User userContext) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (!notificationOpt.isPresent())
            throw new DataNotFoundException(Notification.class, Map.of("id", Objects.toString(notificationId)));

        Notification notification = notificationOpt.get();

        if (notification.getUserId() != userContext.getId())
            throw new NoPermissionException(Notification.class, userContext.getUsername());

        return notification;
    }

}
