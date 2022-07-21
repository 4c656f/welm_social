import api from "../../http";
import {AxiosResponse} from 'axios'
import {AuthResponse} from "../../types/AuthResponse";

export default class AuthService{

    static login(email: string, password: string): Promise<AxiosResponse<AuthResponse>>{

        return api.post<AuthResponse>("/login", {
            "email": email,
            "password": password
        })
    }
    static async registration(nickname:string, email: string, password: string): Promise<AxiosResponse>{
        let data = await api.post<boolean>("/registration", {
            "email": email,
            "nickname": nickname,
            "password": password
        })

        return data
    }
    static async logout():Promise<any>{
        let data = await api.post<boolean>("/logout")

        return data
    }
}