import {authRequest, RequestMethod} from "../utils/httpUtils";
import {RelatedTask, Task} from "../model/models";
import {CreateTaskFormData} from "../componens/dialog/CreateTaskDialog";
import {RelationshipLine} from "../model/enums";

const TaskAPI = {
    create: async function (task: CreateTaskFormData) {
        return authRequest<Task>('/api/v1/tasks', RequestMethod.Post, {}, task)
    },
    get: async function (taskId: Number) {
        return authRequest<Task>(`/api/v1/tasks/${taskId}`, RequestMethod.Get)
    },
    update: async function (task: Task) {
        return authRequest<any>(`/api/v1/tasks/${task.id}`, RequestMethod.Put, {}, task)
    },
    delete: async function (taskId: Number) {
        return authRequest<any>(`/api/v1/tasks/${taskId}`, RequestMethod.Delete)
    },
    createRelationship: async function (taskId: number, relatedTaskId: number) {
        return authRequest<RelatedTask>(`/api/v1/tasks/${taskId}/relationship`, RequestMethod.Post, {}, {relatedTaskId: relatedTaskId, relationshipType: 'PREVIOUS_ACTIVITY'})
    },
    updateRelationship: async function (taskId: number, relatedTaskId: number, minimumTimeGap?: number, maximumTimeGap?: number) {
        return authRequest<any>(`/api/v1/tasks/${taskId}/relationship/${relatedTaskId}?type=PREVIOUS_ACTIVITY`, RequestMethod.Put, {}, {minimumTimeGap: minimumTimeGap, maximumTimeGap: maximumTimeGap})
    },
    deleteRelationship: async function (taskId: number, relatedTaskId: number) {
        return authRequest<any>(`/api/v1/tasks/${taskId}/relationship/${relatedTaskId}?type=PREVIOUS_ACTIVITY`, RequestMethod.Delete)
    },
    getNotRelatedTask: async function (taskId: Number) {
        return authRequest<Task[]>(`/api/v1/tasks/${taskId}/not-related-tasks`, RequestMethod.Get)
    },
    getTaskSuccessor: async function (taskId: Number) {
        return authRequest<RelatedTask[]>(`/api/v1/tasks/${taskId}/successor`, RequestMethod.Get)
    },
    getTaskPredecessor: async function (taskId: Number) {
        return authRequest<RelatedTask[]>(`/api/v1/tasks/${taskId}/predecessors`, RequestMethod.Get)
    },

}

export {TaskAPI}