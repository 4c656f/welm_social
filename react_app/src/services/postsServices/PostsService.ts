import api from "../../http";
import {AxiosResponse} from 'axios'

import {IPost} from "../../types/IPost";

export default class AuthService{

    static async GetPosts(start: number, end: number, sort: string, interval:number): Promise<AxiosResponse<IPost[]>>{

        return api.post<IPost[]>("/get_posts", {
            "start": start,
            "end": end,
            "sort": sort,
            "interval": interval
        })
    }






}