package cz.uhk.projectmgmt.security;

import cz.uhk.projectmgmt.security.dto.AuthenticationRequest;
import cz.uhk.projectmgmt.security.dto.AuthenticationResponse;
import cz.uhk.projectmgmt.security.dto.RefreshTokenRequest;
import cz.uhk.projectmgmt.security.jwt.JwtUtils;
import cz.uhk.projectmgmt.repository.RefreshTokenRepository;
import cz.uhk.projectmgmt.model.RefreshToken;
import cz.uhk.projectmgmt.model.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthenticationService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final RefreshTokenRepository refreshTokenRepository;

    public AuthenticationService(AuthenticationManager authenticationManager,
                                 JwtUtils jwtUtils,
                                 RefreshTokenRepository refreshTokenRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public AuthenticationResponse authenticate(AuthenticationRequest authenticationRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authenticationRequest.getUsername(), authenticationRequest.getPassword())
        );

        User user = (User) authentication.getPrincipal();
        String token = jwtUtils.generateToken(user);
        RefreshToken refreshToken = jwtUtils.generateRefreshToken(user);

        refreshTokenRepository.persist(refreshToken);

        return new AuthenticationResponse(token, refreshToken.getToken(), user.mapEntityToDTO(false));
    }

    public AuthenticationResponse refreshToken(RefreshTokenRequest refreshTokenRequest) {
        return refreshTokenRepository.findRefreshToken(refreshTokenRequest.getRefreshToken())
                .map(refreshToken -> {
                    if (refreshToken.isRevoked() || LocalDateTime.now().isAfter(refreshToken.getExpirationDate())) {
                        refreshTokenRepository.remove(refreshToken);
                        throw new BadCredentialsException("Refresh token expired");
                    } else {
                        return new AuthenticationResponse(jwtUtils.generateToken(refreshToken.getUser()), refreshToken.getToken(), null);
                    }
                }).orElseThrow(() -> new BadCredentialsException("Invalid refresh token"));
    }

}
