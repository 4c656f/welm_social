import api from "../../http";
import {AxiosResponse} from 'axios'

export default class ValidationService{

    static validate(email: string, nickname: string):Promise<AxiosResponse>{

        let resp = api.get("/get_check_nickname", { params: { "email": email, "nickname": nickname } })

        return resp
    }
}