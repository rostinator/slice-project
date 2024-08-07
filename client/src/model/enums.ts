export enum Color {
    BLUE,
    GREEN,
    BROWN,
    GREY,
    RED,
    WHITE,
    PINK,
    YELLOW,
    BLACK,
    PURPLE,
    ORANGE
}

export enum Priority {
    URGENT = "URGENT",
    HIGH = "HIGH",
    NORMAL = "NORMAL",
    LOW = "LOW",
}

export enum Status {
    NEW = "NEW",
    ON_HOLD = "ON_HOLD",
    WAITING = "WAITING",
    IN_PROGRESS = "IN_PROGRESS",
    DONE = "DONE",
}

export enum Role {
    USER,
    ADMIN,
}

export enum ProjectType {
    PRIVATE = "PRIVATE",
    PUBLIC = "PUBLIC",
}

export enum ProjectStatus {
    NEW = "NEW",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED",
    CANCELLED = "CANCELLED",
}

export enum ProjectRole {
    OWNER = "OWNER",
    MANAGER = "MANAGER",
    READER = "READER",
    MEMBER = "MEMBER",
}


export enum RelationshipLine {
    SUCCESSOR = "SUCCESSOR",
    PREDECESSOR = "PREDECESSOR",
}

export enum ProjectMemberStatus {
    ACTIVE = "ACTIVE",
    WAITING_FOR_CONFIRMATION = "WAITING_FOR_CONFIRMATION",
    CONFIRMATION_REJECTED = "CONFIRMATION_REJECTED",
    USER_LEFT_TEAM = "USER_LEFT_TEAM",
}

export enum NotificationType {
    PROJECT_INVITATION = "PROJECT_INVITATION",
}
