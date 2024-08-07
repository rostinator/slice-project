package cz.uhk.projectmgmt.repository;

import cz.uhk.projectmgmt.enums.PROJECT_MEMBER_STATUS;
import cz.uhk.projectmgmt.model.ProjectMember;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ProjectMemberRepository extends GenericRepository<ProjectMember, Integer> {


    public ProjectMemberRepository() {
        super(ProjectMember.class);
    }

    public List<ProjectMember> readProjectMembers(Integer projectId) {
        return getEntityManager()
                .createNativeQuery("select pm.* from PROJECT_MEMBERS pm " +
                        "where pm.project_id = :projectId", ProjectMember.class)
                .setParameter("projectId", projectId)
                .getResultList();
    }

    public List<ProjectMember> readProjectMembers(Integer projectId, PROJECT_MEMBER_STATUS status) {
        return getEntityManager()
                .createNativeQuery("select pm.* from PROJECT_MEMBERS pm " +
                        "where pm.project_id = :projectId and pm.status = :status", ProjectMember.class)
                .setParameter("projectId", projectId)
                .setParameter("status", status.name())
                .getResultList();
    }

    public Optional<ProjectMember> readProjectMember(Integer projectId, Integer userId) {
        return getEntityManager()
                .createQuery("select pm from ProjectMember pm " +
                        "where pm.project.id = :projectId and pm.user.id = :userId", ProjectMember.class)
                .setParameter("projectId", projectId)
                .setParameter("userId", userId)
                .getResultStream()
                .findFirst();
    }

    public Optional<ProjectMember> readProjectMemberForNotification(Integer notificationId) {
        return getEntityManager()
                .createQuery("select pm from ProjectMember pm " +
                        "where pm.notification.id = :notificationId", ProjectMember.class)
                .setParameter("notificationId", notificationId)
                .getResultStream()
                .findFirst();
    }
}
