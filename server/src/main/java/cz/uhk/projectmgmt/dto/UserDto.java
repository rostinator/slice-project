package cz.uhk.projectmgmt.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class UserDto {

    private final Integer id;

    @NotBlank
    @Size(min = 5, max = 256)
    private final String username;

    @NotBlank
    @Size(max = 128)
    private final String firstName;

    @NotBlank
    @Size(max = 128)
    private final String lastName;

    @NotBlank
    @Email
    private final String email;

    public UserDto(
            Integer id,
            String username,
            String firstName,
            String lastName,
            String email
    ) {
        this.id = id;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    public Integer getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

}
