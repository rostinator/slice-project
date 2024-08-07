import {ProjectRole} from "../model/enums";
import {date} from "yup";
import dayjs from "dayjs";

export const formatDate = (value: any): string => {
    if (value) {
        const date = new Date(value)
        return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
    } else {
        return ''
    }
}

export const formatDateTime = (value: any): string => {
    if (value) {
        const date = new Date(value)
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes() < 10 ? "0" : ''}${date.getMinutes()}:${date.getSeconds() < 10 ? "0" : ''}${date.getSeconds()}`
    } else {
        return ''
    }
}

export const userInitials = (firstName?: string, lastName?: string): string => {
    return firstName && lastName ? firstName[0] + lastName[0] : ''
}


export const stringToColor = (string: string) : string => {
    let hash = 0
    let i

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff
        color += `00${value.toString(16)}`.slice(-2)
    }
    return color
}

export const canUserEditProject = (userRole?: ProjectRole): boolean => {
    return !!userRole && (userRole == ProjectRole.MANAGER || userRole == ProjectRole.OWNER)
}

export const canUserEditTask = (userId: number, assignedUserId?: number, userRole?: ProjectRole): boolean => {
    return !!userRole && (userRole == ProjectRole.MANAGER || userRole == ProjectRole.OWNER || userId === assignedUserId)
}

export const dateDiffInDays = (a: Date, b: Date): number => {
    a = new Date(a)
    b = new Date(b)
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())

    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24)) + 1
}

export const convertToDate = (dayjs: dayjs.Dayjs): Date => {
    const date = dayjs.toDate()

    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getDate() + 1)
}