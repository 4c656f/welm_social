export interface IPost {
    id: number;
    title: string;
    content: string;
    author_nickname: string;
    creation_date: string;
    postLink: string;
    author_id: number;
    likes: number;
    comments: number;
}