import api from "../http";
import {AxiosResponse} from 'axios'
import {AuthResponse} from "../types/AuthResponse";

export default class AuthService{

    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>>{

        return api.post<AuthResponse>("/login", {
            "email": email,
            "password": password
        },{

        })
    }
}