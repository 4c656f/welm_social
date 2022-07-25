import api from "../../http";
import {AxiosResponse} from 'axios'
import {IPost} from "../../types/IPost";
import {IUser} from "../../types/IUser";
import {IGetPostsArgs} from "../../types/IGetPostsArgs";

export default class AuthService{

    static async GetPosts(args:IGetPostsArgs): Promise<AxiosResponse<IPost[]>>{
        return api.post<IPost[]>("/get_posts", {
            "start": args.start,
            "end": args.end,
            "sort": args.sort,
            "interval": args.interval,
            "user": args.user,
            "ticker": args.ticker
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