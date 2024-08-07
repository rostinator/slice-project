package cz.uhk.projectmgmt.repository;

import cz.uhk.projectmgmt.enums.PROJECT_MEMBER_STATUS;
import cz.uhk.projectmgmt.model.Project;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ProjectRepository extends GenericRepository<Project, Integer> {
    public ProjectRepository() {
        super(Project.class);
    }

    public Optional<Project> findUserProjectByName(String name, Integer userId) {
        return getEntityManager()
                .createNativeQuery("select p.* from PROJECTS p " +
                        "inner join PROJECT_MEMBERS pm on p.id = pm.PROJECT_ID " +
                        "where pm.user_id = :userId and UPPER(p.name) = UPPER(:name)", Project.class)
                .setParameter("userId", userId)
                .setParameter("name", name)
                .getResultStream()
                .findFirst();
    }

    public List<Project> readAllActiveUserProjects(Integer userId) {
        return getEntityManager()
                .createNativeQuery("select p.* from PROJECTS p " +
                        "inner join PROJECT_MEMBERS pm on p.id = pm.PROJECT_ID " +
                        "where pm.user_id = :userId and pm.status = :status", Project.class)
                .setParameter("userId", userId)
                .setParameter("status", PROJECT_MEMBER_STATUS.ACTIVE.name())
                .getResultList();
    }


}
