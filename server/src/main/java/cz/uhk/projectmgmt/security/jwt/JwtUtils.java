package cz.uhk.projectmgmt.security.jwt;

import cz.uhk.projectmgmt.model.RefreshToken;
import cz.uhk.projectmgmt.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Component
public class JwtUtils {

    @Value("${app.jwt.secret}")
    private String secretJwtKey;

    @Value("${app.jwt.expiration}")
    private long tokenExpiration;

    @Value("${app.jwt.refresh-expiration}")
    private long refreshTokenExpiration;

    public String generateToken(User user) {
        return generateJwtToken(user, new Date(System.currentTimeMillis() + tokenExpiration));
    }

    public RefreshToken generateRefreshToken(User user) {
        Date expiration = new Date(System.currentTimeMillis() + refreshTokenExpiration);
        String token = generateJwtToken(user, expiration);

        return new RefreshToken(
                token,
                false,
                LocalDateTime.ofInstant(expiration.toInstant(), ZoneId.systemDefault()),
                user
        );
    }

    private String generateJwtToken(User user, Date expiration) {
        return Jwts
                .builder()
                .setSubject(user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(expiration)
                .signWith(SignatureAlgorithm.HS512, secretJwtKey)
                .compact();
    }

    public boolean validJwtToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretJwtKey).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String parseUsernameFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(secretJwtKey)
                .parseClaimsJws(token)
                .getBody().getSubject();
    }
}
