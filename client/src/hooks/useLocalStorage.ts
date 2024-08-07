import {useEffect, useState} from "react"
import {Nullable} from "../model/models";

export const USER_KEY: string = 'USER'
export const AUTH_TOKEN_KEY: string = 'AUTH_TOKEN'
export const REFRESH_TOKEN_KEY: string = 'REFRESH_TOKEN'


export function useLocalStorage<T>(key: string, initValue: Nullable<T>) {
    const [value, setValue] = useState<Nullable<T>>(() => {
        const jsonValue = localStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : initValue
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue] as [T, typeof setValue]
}