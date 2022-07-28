import api from "../../http";
import {AxiosResponse} from 'axios'
import {IPost} from "../../types/IPost";
import {IUser} from "../../types/IUser";


export default class AuthService{

    static async GetPosts(start:number, end:number, sort:"new"|"popular", interval:1|7|30|365, user:boolean|object, ticker:boolean|string): Promise<AxiosResponse<IPost[]>>{

        return api.post<IPost[]>("/get_posts", {
            "start": start,
            "end": end,
            "sort": sort,
            "interval": Number(interval),
            "user": user,
            "ticker": ticker
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
    static async SavePost(user: IUser, postId:number): Promise<AxiosResponse<boolean>>{


        return api.post<boolean>("/save_post", {
            "user": user,
            "post_id":postId,
        })
    }







}