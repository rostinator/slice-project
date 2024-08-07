package cz.uhk.projectmgmt.repository;


import cz.uhk.projectmgmt.model.Notification;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class NotificationRepository extends GenericRepository<Notification, Integer> {
    public NotificationRepository() {
        super(Notification.class);
    }

    public List<Notification> readUserNotifications(Integer userId) {
        return getEntityManager()
                .createQuery("select n from Notification n " +
                        "where n.userId = :userId " +
                        "order by n.id desc", Notification.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    public Integer readUnreadNotificationsCount(Integer userId) {
        return getEntityManager()
                .createQuery("select count(n) from Notification n " +
                        "where n.userId = :userId and n.unread", Long.class)
                .setParameter("userId", userId)
                .getSingleResult()
                .intValue();
    }

    public Optional<Notification> readRelatedNotification(Integer relatedEntityId) {
        return getEntityManager()
                .createQuery("select n from Notification n " +
                        "where relatedEntityId = :relatedEntityId", Notification.class)
                .setParameter("relatedEntityId", relatedEntityId)
                .getResultStream()
                .findFirst();
    }

}
