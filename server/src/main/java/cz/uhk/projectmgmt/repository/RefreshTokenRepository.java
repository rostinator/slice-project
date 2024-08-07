package cz.uhk.projectmgmt.repository;

import cz.uhk.projectmgmt.model.RefreshToken;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class RefreshTokenRepository extends GenericRepository<RefreshToken, Integer> {

    public RefreshTokenRepository() {
        super(RefreshToken.class);
    }

    public Optional<RefreshToken> findRefreshToken(String refreshToken) {
        return getEntityManager().createQuery("select r from RefreshToken r where r.token = :refreshToken", RefreshToken.class)
                .setParameter("refreshToken", refreshToken)
                .getResultStream()
                .findFirst();
    }

}
