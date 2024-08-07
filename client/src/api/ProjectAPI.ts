import {authRequest, RequestMethod} from "../utils/httpUtils";
import {CreateProjectFormData} from "../componens/dialog/CreateProjectDialog";
import {Project, ProjectMember, UpdateProject} from "../model/models";
import {ProjectMemberStatus, ProjectRole} from "../model/enums";
import {CreateProjectMemberFormData} from "../componens/dialog/CreateProjectMemberDialog";

const ProjectAPI = {
    create: async function (project: CreateProjectFormData) {
        return authRequest<Project>('/api/v1/projects', RequestMethod.Post, {}, project)
    },
    get: async function (projectId: number) {
        return authRequest<Project>(`/api/v1/projects/${projectId}`, RequestMethod.Get)
    },
    update: async function (updateProject: UpdateProject) {
        return authRequest<any>(`/api/v1/projects/${updateProject.id}`, RequestMethod.Put, {}, updateProject)
    },
    delete: async function (projectId: number) {
        return authRequest<any>(`/api/v1/projects/${projectId}`, RequestMethod.Delete)
    },
    getName: async function (projectId: number) {
        return authRequest<string>(`/api/v1/projects/${projectId}/name`, RequestMethod.Get)
    },
    getAllProjectMembers: async function (projectId: number) {
        return authRequest<ProjectMember[]>(`/api/v1/projects/${projectId}/members`, RequestMethod.Get)
    },
    getProjectMembers: async function (projectId: number, status: ProjectMemberStatus) {
        return authRequest<ProjectMember[]>(`/api/v1/projects/${projectId}/members?status=${status}`, RequestMethod.Get)
    },
    createProjectMember: async function (projectId: number, projectMember: CreateProjectMemberFormData) {
        return authRequest<ProjectMember>(`/api/v1/projects/${projectId}/members`, RequestMethod.Post, {}, projectMember)
    },
    changeProjectMemberRole: async function (projectId: number, userId: number, newRole: ProjectRole) {
        return authRequest<any>(`/api/v1/projects/${projectId}/members/${userId}`, RequestMethod.Put, {}, {newRole: newRole})
    },
    deleteProjectMember: async function (projectId: number, userId: number) {
        return authRequest<any>(`/api/v1/projects/${projectId}/members/${userId}`, RequestMethod.Delete)
    },
}

export {ProjectAPI}