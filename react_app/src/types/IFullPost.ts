import {IPost} from "./IPost";


export interface IComment {
    id:number;
    author_nickname: string;
    author_id: number;
    post_id:number;
    content:string
    creation_date:number;
}

export interface IFullPost  extends  IPost{
    comments_full: IComment[];
}