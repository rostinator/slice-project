package cz.uhk.projectmgmt.model;

import cz.uhk.projectmgmt.dto.NotificationDto;
import cz.uhk.projectmgmt.enums.NOTIFICATION_TYPE;
import jakarta.persistence.*;
import org.hibernate.type.YesNoConverter;

@Entity
@Table(name = "NOTIFICATIONS")
public class Notification extends EntityWithChanges implements EntityWithDTO<NotificationDto> {

    @Column(nullable = false, name = "USER_ID")
    private Integer userId;

    @Column(nullable = false)
    @Convert(converter = YesNoConverter.class)
    private boolean unread;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NOTIFICATION_TYPE type;

    @Column(nullable = false, length = 512)
    private String content;

    @Column(nullable = false)
    @Convert(converter = YesNoConverter.class)
    private boolean resolved;

    public Notification() {
    }

    public Notification(String createdBy, Integer userId, boolean unread, NOTIFICATION_TYPE type, String content) {
        super(createdBy);
        this.userId = userId;
        this.unread = unread;
        this.type = type;
        this.content = content;
        this.resolved = false;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public boolean isUnread() {
        return unread;
    }

    public void setUnread(boolean unread) {
        this.unread = unread;
    }

    public NOTIFICATION_TYPE getType() {
        return type;
    }

    public void setType(NOTIFICATION_TYPE type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isResolved() {
        return resolved;
    }

    public void setResolved(boolean resolved) {
        this.resolved = resolved;
    }

    @Override
    public NotificationDto mapEntityToDTO(boolean fetchCollections) {
        return new NotificationDto(
                getId(),
                type,
                getCreatedOn(),
                unread,
                userId,
                content,
                resolved
        );
    }
}
