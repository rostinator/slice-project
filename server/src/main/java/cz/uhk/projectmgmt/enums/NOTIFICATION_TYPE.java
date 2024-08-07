package cz.uhk.projectmgmt.enums;

import cz.uhk.projectmgmt.model.ProjectMember;

public enum NOTIFICATION_TYPE {

    PROJECT_INVITATION(ProjectMember.class),
    ;

    private final Class<?> relatedEntityClazz;

    NOTIFICATION_TYPE(Class<?> relatedEntityClazz) {
        this.relatedEntityClazz = relatedEntityClazz;
    }

    public Class<?> getRelatedEntityClazz() {
        return relatedEntityClazz;
    }
}
