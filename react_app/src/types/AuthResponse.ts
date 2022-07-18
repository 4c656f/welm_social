import {IUser} from "./IUser";

interface IToken{
    access_token: string;
    refresh_token: string;
}


export interface AuthResponse {
    tokens: IToken;
    user: IUser;
}