import api from "../../http";
import {AxiosResponse} from 'axios'

import {IPost} from "../../types/IPost";
import {IUser} from "../../types/IUser";

export default class AuthService{

    static async GetPosts(start: number, end: number, sort: string, interval:number): Promise<AxiosResponse<IPost[]>>{

        return api.post<IPost[]>("/get_posts", {
            "start": start,
            "end": end,
            "sort": sort,
            "interval": interval
        })
    }
    static async GetTickerPosts(start: number, end: number, sort: string, interval:number, ticker:string): Promise<AxiosResponse<IPost[]>>{

        return api.post<IPost[]>("/get_posts_by_ticker", {
            "ticker": ticker,
            "start": start,
            "end": end,
            "sort": sort,
            "interval": interval
        })
    }
    static async AddLike(user: IUser, likeType:number, postId:number): Promise<AxiosResponse<boolean>>{
        const data = {"user": user,
            "like":{
                "like_type":likeType,
                "post_id":postId
            }
        }
        return api.post<boolean>("/like", {
            data
        })
    }







}