package cz.uhk.projectmgmt.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterUserDto(@NotBlank @Size(min = 5, max = 50) String username,
                              @NotBlank @Size(max = 128) String firstName,
                              @NotBlank @Size(max = 128) String lastName,
                              @NotBlank @Email String email,
                              @NotBlank String password) {

    public RegisterUserDto(String username, String firstName, String lastName, String email, String password) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}
