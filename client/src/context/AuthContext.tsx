import React, {createContext, PropsWithChildren} from "react";
import {AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY, useLocalStorage, USER_KEY} from "../hooks/useLocalStorage";
import {User} from "../model/models";
import {AuthenticationResponse} from "../model/apiResponse";

export interface AuthContextType {
    logout(): void
    login(userData: AuthenticationResponse): void
    currentUser: User
    isAuthorized(): boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
    const [authToken, setAuthToken] = useLocalStorage<string>(AUTH_TOKEN_KEY, null)
    const [refreshToken, setRefreshToken] = useLocalStorage<string>(REFRESH_TOKEN_KEY, null)
    const [currentUser, setCurrentUser] = useLocalStorage<User>(USER_KEY, null)

    const login = (userData: AuthenticationResponse): void => {
        setAuthToken(userData.token)
        setRefreshToken(userData.refreshToken)
        if (userData.user) setCurrentUser(userData.user)
    }

    const logout = (): void => {
        setAuthToken(null)
        setRefreshToken(null)
        setCurrentUser(null)
    }

    const isAuthorized = (): boolean => {
        return currentUser !== null
    }

    return (
        <AuthContext.Provider value={{logout, login, currentUser, isAuthorized}}>
            {props.children}
        </AuthContext.Provider>
    )

}