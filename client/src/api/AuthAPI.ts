import {request, RequestMethod} from "../utils/httpUtils";
import {AuthenticationResponse} from "../model/apiResponse";
import {SignInFormData} from "../pages/SingInForm";
import {SignUpFormData} from "../pages/SignUp";

const AuthAPI = {
    login: async function (auth: SignInFormData) {
        return request<AuthenticationResponse>('auth/login', RequestMethod.Post, {}, auth)
    },
    register: async function (userDto: SignUpFormData) {
        return request('auth/register', RequestMethod.Post, {}, userDto)
    }
}

export {AuthAPI}