package cz.uhk.projectmgmt.exception;

import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public class DataNotFoundException extends RuntimeException {

    private final Class<?> clazz;

    private final Map<String, Object> parameters;

    public DataNotFoundException(Class<?> clazz, Map<String, Object> parameters) {
        this.clazz = clazz;
        this.parameters = parameters;
    }

    public Class<?> getClazz() {
        return clazz;
    }

    public String getParameters() {
        if (parameters.isEmpty()) {
            return "{}";
        } else {
            return "{" +
                    parameters.entrySet().stream().map(entry -> "%s=%s".formatted(entry.getKey(), Objects.toString(entry.getValue()))).collect(Collectors.joining(", "))
                    + "}";
        }
    }

}
