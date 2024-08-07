package cz.uhk.projectmgmt.exception;

public class BusinessValidationException extends RuntimeException {

    private final String messageKey;

    private final Object[] args;

    public BusinessValidationException(String messageKey, Object... args) {
        this.messageKey = messageKey;
        this.args = args;
    }

    public String getMessageKey() {
        return messageKey;
    }

    public Object[] getArgs() {
        return args;
    }
}
