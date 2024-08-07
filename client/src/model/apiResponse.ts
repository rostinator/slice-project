import {User} from "./models";

export interface AuthenticationResponse {
    token: string;
    refreshToken: string;
    user?: User;
}