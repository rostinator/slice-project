package cz.uhk.projectmgmt.repository;

import cz.uhk.projectmgmt.model.User;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserRepository extends GenericRepository<User, Integer> {

    public UserRepository() {
        super(User.class);
    }

    public Optional<User> findUserByUsername(String username) {
        return getEntityManager()
                .createQuery("select u from User u where u.username = :username", User.class)
                .setParameter("username", username)
                .getResultStream()
                .findFirst();
    }

    public Optional<User> findUserByEmail(String email) {
        return getEntityManager()
                .createQuery("select u from User u where u.email = :email", User.class)
                .setParameter("email", email)
                .getResultStream()
                .findFirst();
    }

}
