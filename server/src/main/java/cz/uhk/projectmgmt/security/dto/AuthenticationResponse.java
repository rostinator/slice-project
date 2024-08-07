package cz.uhk.projectmgmt.security.dto;

import cz.uhk.projectmgmt.dto.UserDto;

public class AuthenticationResponse {

    private final String token;

    private final String refreshToken;

    private final UserDto user;

    public AuthenticationResponse(String token, String refreshToken, UserDto user) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public UserDto getUser() {
        return user;
    }
}
