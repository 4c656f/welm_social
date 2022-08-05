import api from "../../http";
import {AxiosResponse} from 'axios'
import {IPost} from "../../types/IPost";
import {IUser} from "../../types/IUser";
import {IFullPost} from "../../types/IFullPost";


export default class PostsService{

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
    static async GetFullPost(user:boolean|IUser,link:string): Promise<AxiosResponse<IFullPost[]>>{

        return api.post<IFullPost[]>("/get_full_post", {
            "link": link,
            "user": user,
        })
    }
    static async AddPost(user: IUser, content:string): Promise<AxiosResponse<boolean>>{


        return api.post<boolean>("/add_post",
        {"user": user,
            "post":{
            "content":content
            }
            }
        )
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
    static async GetSavePost(user: IUser): Promise<AxiosResponse<IPost[]>>{

        return api.post<IPost[]>("/get_save_posts", {
            "user": user,
        })
    }
    static async AddComment(user: IUser, content:string, postId:number): Promise<AxiosResponse<boolean>>{

        const data = {"user": user,
            "comment":{
                "content":content,
                "post_id":postId
            }
        }
        return api.post<boolean>("/add_comment", {"user": user,
            "comment":{
                "content":content,
                "post_id":postId
            }
        })
    }







}