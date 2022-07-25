export interface IGetPostsArgs{
    start:number;
    end:number;
    sort: "new"|"popular";
    interval: 1|7|30|365;
    user: boolean|object;
    ticker:boolean|string;
}
