package cz.uhk.projectmgmt.service;

import cz.uhk.projectmgmt.dto.RegisterUserDto;
import cz.uhk.projectmgmt.exception.BusinessValidationException;
import cz.uhk.projectmgmt.model.User;
import cz.uhk.projectmgmt.repository.UserRepository;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProjectService projectService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       ProjectService projectService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.projectService = projectService;
    }

    @Transactional(rollbackFor = Exception.class)
    public void registerNewUser(RegisterUserDto registerUserDto) {
        if (!isValidUsername(registerUserDto.username()))
            throw new BusinessValidationException("user.username.invalid");

        if (userRepository.findUserByUsername(registerUserDto.username()).isPresent())
            throw new BusinessValidationException("user.username.already.used");

        if (userRepository.findUserByEmail(registerUserDto.email()).isPresent())
            throw new BusinessValidationException("user.email.not.unique", registerUserDto.email());

        if (!isValidPassword(registerUserDto.password()))
            throw new BusinessValidationException("user.password.invalid");

        User newUser = new User(
                registerUserDto.username(),
                registerUserDto.firstName(),
                registerUserDto.lastName(),
                registerUserDto.email(),
                passwordEncoder.encode(registerUserDto.password()),
                registerUserDto.username()
        );

        userRepository.persist(newUser);

        projectService.createDemoProject(newUser);
    }

    private boolean isValidPassword(String password) {
        return StringUtils.isMixedCase(password)
                && password.length() > 8
                && !StringUtils.containsWhitespace(password)
                && !StringUtils.isAlphanumeric(password);
    }

    private boolean isValidUsername(String username) {
        return StringUtils.isNotBlank(username)
                && !StringUtils.containsWhitespace(username)
                && username.length() > 5;
    }

}
