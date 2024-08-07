const JWT_KEY: string = 'JWT'

const getStoredJwt = (): string | null => {
    return localStorage.getItem(JWT_KEY)
}

const setStoredJwt = (token: string): void => {
    localStorage.setItem(JWT_KEY, token)
}

export {getStoredJwt, setStoredJwt}