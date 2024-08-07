package cz.uhk.projectmgmt.model;

import cz.uhk.projectmgmt.dto.UserDto;
import jakarta.persistence.*;
import org.hibernate.type.YesNoConverter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "USERS")
public class User extends EntityWithChanges implements UserDetails, EntityWithDTO<UserDto> {

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 128)
    private String firstName;

    @Column(nullable = false, length = 128)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, length = 512)
    private String password;

    @Column(nullable = false)
    @Convert(converter = YesNoConverter.class)
    private boolean enable;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "ASSIGNED_USER_ID", foreignKey = @ForeignKey(name = "FK_TASKS_USERS"))
    private Set<Task> assignedTasks = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", foreignKey = @ForeignKey(name = "FK_PROJECT_MEMBERS_USERS"))
    private Set<ProjectMember> projects = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_ID", foreignKey = @ForeignKey(name = "FK_NOTIFICATIONS_USERS"))
    private Set<Notification> notifications = new HashSet<>();

    public User() {
    }

    public User(String username, String firstName, String lastName, String email, String password, String createdBy) {
        super(createdBy);
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.enable = true;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return "%s %s".formatted(firstName, lastName);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptySet();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return enable;
    }

    @Override
    public boolean isAccountNonLocked() {
        return enable;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return enable;
    }

    @Override
    public boolean isEnabled() {
        return enable;
    }

    @Override
    public UserDto mapEntityToDTO(boolean fetchCollections) {
        return new UserDto(
                this.getId(),
                this.getUsername(),
                this.getFirstName(),
                this.getLastName(),
                this.getEmail()
        );
    }
}
