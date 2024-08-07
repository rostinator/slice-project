package cz.uhk.projectmgmt.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
@Transactional
public abstract class GenericRepository<CLAZZ, ID> {

    private final Class<CLAZZ> aClass;

    @PersistenceContext
    private EntityManager entityManager;

    public GenericRepository(Class<CLAZZ> aClass) {
        this.aClass = aClass;
    }

    protected EntityManager getEntityManager() {
        return entityManager;
    }

    public Optional<CLAZZ> findById(ID id) {
        return Optional.ofNullable(entityManager.find(aClass, id));
    }

    public <T> T persist(T entity) {
        entityManager.persist(entity);
        return entity;
    }

    public void persistObject(Object entity) {
        entityManager.persist(entity);
    }

    public void remove(Object entity) {
        entityManager.remove(entity);
    }

    public <T> T merge(T entity) {
        return entityManager.merge(entity);
    }

}
