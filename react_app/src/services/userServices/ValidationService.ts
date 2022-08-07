import api from "../../http";
import {AxiosResponse} from 'axios'

export default class ValidationService{

    static validate(email: string, nickname: string):Promise<AxiosResponse<boolean>>{

        let resp = api.post<boolean>("/get_check_nickname", {"email": email, "nickname": nickname })

        return resp
    }
}