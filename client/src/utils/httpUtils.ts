import axios, {AxiosError, AxiosInstance} from 'axios'
import {AuthenticationResponse} from "../model/apiResponse";
import {AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY} from "../hooks/useLocalStorage";

const httpClient: AxiosInstance = axios.create({
    // baseURL: 'https://slice-project.onrender.com'
    baseURL: 'http://localhost:8080/'
})

httpClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('AUTH_TOKEN')
    if (token) config.headers['Authorization'] = 'Bearer ' + JSON.parse(token)
    config.headers['Accept-Language'] = 'cs'
    return config
})

interface ApiResponse<T> {
    statusCode?: number
    data?: T
    errorMessage?: string
    isSuccessful: boolean
}

export enum RequestMethod {
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Delete = 'DELETE'
}

export const authRequest = async <T = any>(url: string, method: RequestMethod, params?: any, body?: any): Promise<ApiResponse<T>> => {
    const response = await request<T>(url, method, params, body)
    if (response.isSuccessful || response.statusCode !== 403) {
        return response
    } else {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
        if (refreshToken != null) {
            const refreshTokenRes = await request<AuthenticationResponse>(
                'auth/refresh-token', RequestMethod.Post, {}, {refreshToken: JSON.parse(refreshToken)})
            if (refreshTokenRes.isSuccessful && refreshTokenRes.data) {
                localStorage.setItem(REFRESH_TOKEN_KEY, JSON.stringify(refreshTokenRes.data.refreshToken))
                localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(refreshTokenRes.data.token))
                const secondRequest = await request<T>(url, method, params, body)
                if (secondRequest.isSuccessful)
                    return secondRequest
            }
        }
    }

    localStorage.clear()
    window.location.reload()
    return {isSuccessful: false}
}

export const request = async <T = any>(url: string, method: RequestMethod, params?: any, body?: any): Promise<ApiResponse<T>> => {
    // remove empty strings
    if (body)
        body = Object.fromEntries(Object.entries(body).filter(value => value[1]))

    try {
        const {data, status} = await httpClient.request<T>({
            url: url,
            method: method,
            params: params,
            data: body,
        })

        return {
            data: data,
            statusCode: status,
            isSuccessful: true
        }
    } catch (e: any) {
        let httpStatusCode: number | undefined
        let errorMessage: string | undefined
        console.log(e)

        if (e instanceof AxiosError && e.code === 'ERR_NETWORK') {
            httpStatusCode = e.status
            errorMessage = e.message
        } else {
            httpStatusCode = e.response?.status
            errorMessage = e.response?.data?.message
        }

        return {
            statusCode: httpStatusCode,
            errorMessage: errorMessage,
            isSuccessful: false
        }
    }
}