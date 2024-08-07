package cz.uhk.projectmgmt.dto;

import cz.uhk.projectmgmt.enums.NOTIFICATION_TYPE;

import java.time.LocalDateTime;

public class NotificationDto {

    private Integer id;
    private NOTIFICATION_TYPE type;
    private LocalDateTime createdOn;
    private boolean unread;
    private Integer userId;
    private String content;
    private boolean resolved;

    public NotificationDto(Integer id, NOTIFICATION_TYPE type, LocalDateTime createdOn, boolean unread, Integer userId, String content, boolean resolved) {
        this.id = id;
        this.type = type;
        this.createdOn = createdOn;
        this.unread = unread;
        this.userId = userId;
        this.content = content;
        this.resolved = resolved;
    }

    public Integer getId() {
        return id;
    }

    public NOTIFICATION_TYPE getType() {
        return type;
    }

    public LocalDateTime getCreatedOn() {
        return createdOn;
    }

    public boolean isUnread() {
        return unread;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getContent() {
        return content;
    }

    public boolean isResolved() {
        return resolved;
    }
}
