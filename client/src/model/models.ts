import {
    NotificationType,
    Priority,
    ProjectMemberStatus,
    ProjectRole,
    ProjectStatus,
    ProjectType,
    Status
} from "./enums";
import {date} from "yup";

export type Nullable<T> = T | null

export interface User {
    username: string;
    firstName: string;
    lastName: string;
    id: number;
    email: string;
}

export interface Project {
    id: number;
    name: string;
    type: ProjectType;
    status: ProjectStatus
    description?: string;
    tasks: Task[];
    members: User[];
}

export interface UpdateProject {
    id: number;
    name: string;
    type: ProjectType;
    status: ProjectStatus
    description?: string;
}

export interface Task {
    id: number;
    name: string;
    priority: Nullable<Priority>;
    startDate: Date;
    endDate: Date;
    progress: number;
    status: Nullable<Status>;
    assignedUserId?: number;
    description?: string;
    projectId: number;
    optimisticEstimation?: number;
    modalEstimation?: number;
    pessimisticEstimation?: number;
    taskSuccessor: RelatedTask[];
    taskPredecessor: RelatedTask[];
}

export interface RelatedTask {
    relatedTaskId: number;
    taskName: string;
    taskStatus: Status;
    minimumTimeGap?: number;
    maximumTimeGap?: number;
}

export interface ProjectMember {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    createdDateTime: Date;
    updatedDateTime: Date;
    role: ProjectRole;
    status: ProjectMemberStatus;
}

export interface Notification {
    id: number;
    type: NotificationType;
    createdOn: Date;
    unread: boolean;
    userId: number;
    content: string;
    resolved: boolean;
}