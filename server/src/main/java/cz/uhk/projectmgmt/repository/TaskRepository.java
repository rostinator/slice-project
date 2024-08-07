package cz.uhk.projectmgmt.repository;

import cz.uhk.projectmgmt.enums.TASK_RELATIONSHIP_TYPE;
import cz.uhk.projectmgmt.model.Task;
import cz.uhk.projectmgmt.model.TaskRelationship;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class TaskRepository extends GenericRepository<Task, Integer> {

    public TaskRepository() {
        super(Task.class);
    }

    public Optional<Task> findTaskByNameInProject(String taskName, Integer projectId) {
        return getEntityManager().createQuery("select t from Task t " +
                        "where t.projectId = :projectId and UPPER(t.name) = UPPER(:taskName)", Task.class)
                .setParameter("projectId", projectId)
                .setParameter("taskName", taskName)
                .getResultStream()
                .findFirst();
    }

    public List<Task> readTaskSuccessor(Integer taskId) {
        return getEntityManager()
                .createQuery("select d from Task d " +
                        "inner join TaskRelationship tr " +
                        "on tr.relatedTaskId = :taskId and d.id = tr.taskId and tr.type = :relationshipType", Task.class)
                .setParameter("taskId", taskId)
                .setParameter("relationshipType", TASK_RELATIONSHIP_TYPE.PREVIOUS_ACTIVITY)
                .getResultList();
    }

    public List<Task> readTaskPredecessors(Integer taskId) {
        return getEntityManager().createQuery("select d from Task d " +
                        "inner join TaskRelationship tr " +
                        "on tr.taskId = :taskId and d.id = tr.relatedTaskId and tr.type = :relationshipType", Task.class)
                .setParameter("taskId", taskId)
                .setParameter("relationshipType", TASK_RELATIONSHIP_TYPE.PREVIOUS_ACTIVITY)
                .getResultList();
    }

    public List<Task> readNotRelatedTasks(Integer taskId) {
        return getEntityManager().createNativeQuery("select allTasks.*\n" +
                        "from tasks currentTask\n" +
                        "         inner join tasks allTasks on currentTask.project_id = allTasks.project_id\n" +
                        "where currentTask.id = :taskId\n" +
                        "  and allTasks.id <> :taskId\n" +
                        "EXCEPT\n" +
                        "select predecessors.*\n" +
                        "from tasks predecessors\n" +
                        "         inner join task_relationships tr on predecessors.id = tr.related_task_id\n" +
                        "where tr.task_id = :taskId\n" +
                        "except\n" +
                        "select successor.*\n" +
                        "from tasks successor\n" +
                        "         inner join task_relationships tr on successor.id = tr.task_id\n" +
                        "where tr.related_task_id = :taskId", Task.class)
                .setParameter("taskId", taskId)
                .getResultList();
    }

    public Optional<TaskRelationship> findTaskRelationship(Integer taskId, Integer relatedTaskId, TASK_RELATIONSHIP_TYPE relationshipType) {
        return getEntityManager().createQuery("select tr from TaskRelationship tr " +
                        "where tr.taskId = :taskId and tr.relatedTaskId = :relatedTaskId and tr.type = :relationshipType", TaskRelationship.class)
                .setParameter("taskId", taskId)
                .setParameter("relatedTaskId", relatedTaskId)
                .setParameter("relationshipType", relationshipType)
                .getResultStream()
                .findFirst();
    }

    public List<Task> readUserAssignedTasks(Integer userId) {
        return getEntityManager().createQuery("select t from Task t " +
                        "where t.assignedUserId = :userId", Task.class)
                .setParameter("userId", userId)
                .getResultList();
    }

}
