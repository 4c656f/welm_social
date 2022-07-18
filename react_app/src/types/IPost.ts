
interface comments{
    id: number;
    like_type: number;
    author_nickname: string;
    author_id: number;

}
interface likes{
    id: number;
    content: string;
    author_nickname: string;
    author_id: number;
}


export interface IPost{
    id: number;
    title: string;
    content: string;
    author_nickname: string;
    author_id: number;
    likes: likes;
    comments: comments;

}