import {authRequest, RequestMethod} from "../utils/httpUtils";
import {Notification, Project, Task} from "../model/models";
import {ProjectRole} from "../model/enums";

const UserAPI = {
    getAllProjects: async function (userId: number) {
        return authRequest<Project[]>(`/api/v1/users/${userId}/projects`, RequestMethod.Get)
    },
    getUserRoleInProject: async function (userId: number, projectId: number) {
        return authRequest<ProjectRole>(`/api/v1/users/${userId}/projects/${projectId}/role`, RequestMethod.Get)
    },
    getUnreadNotificationsCount: async function (userId: number) {
        return authRequest<number>(`/api/v1/users/${userId}/notifications/count`, RequestMethod.Get)
    },
    getNotifications: async function (userId: number) {
        return authRequest<Notification[]>(`/api/v1/users/${userId}/notifications`, RequestMethod.Get)
    },
    markNotificationAsRead: async function (notificationId: number) {
        return authRequest<any>(`/api/v1/users/notifications/${notificationId}/mark-read`, RequestMethod.Put)
    },
    resolveNotification: async function (notificationId: number, confirmed: boolean) {
        return authRequest<any>(`/api/v1/users/notifications/${notificationId}/resolve?confirmed=${confirmed}`, RequestMethod.Put)
    },
    getAssignedTasks: async function (userId: number) {
        return authRequest<Task[]>(`/api/v1/users/${userId}/assigned-tasks`, RequestMethod.Get)
    },
}

export {UserAPI}