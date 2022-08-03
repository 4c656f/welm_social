export interface ITag{
    id:number;
    ticker_tag:string;
    post_id:number;
}

export interface IPost {
    id: number;
    content: string;
    author_nickname: string;
    creation_date: string;
    post_link: string;
    author_id: number;
    likes: number;
    tags: ITag[];
    comments: number;
    like_initial:number;
    is_saved:number;
}