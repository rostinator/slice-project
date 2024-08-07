package cz.uhk.projectmgmt.exception;

public class NoPermissionException extends RuntimeException {

    private final Class clazz;

    private final String userId;

    public NoPermissionException(Class clazz, String userId) {
        this.clazz = clazz;
        this.userId = userId;
    }

    public Class getClazz() {
        return clazz;
    }

    public String getUserId() {
        return userId;
    }
}
