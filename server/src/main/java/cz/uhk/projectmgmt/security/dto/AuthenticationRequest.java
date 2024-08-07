package cz.uhk.projectmgmt.security.dto;

import jakarta.validation.constraints.NotBlank;

public class AuthenticationRequest {

    @NotBlank
    private final String username;

    @NotBlank
    private final String password;

    public AuthenticationRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}
