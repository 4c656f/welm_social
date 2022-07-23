import {IUser} from "../types/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/userServices/AuthService";
import axios from "axios";
import {API_URL} from "../http";
import {AuthResponse} from "../types/AuthResponse";


export default class Store{

    user = {} as IUser;
    isAuth = false;
    isLoading = false;


    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool:boolean){
        this.isAuth = bool;
    }
    setUser(user: IUser){
        this.user = user;
    }

    async login(email:string, password: string){
        try{
            const response = await AuthService.login(email,password);
            localStorage.setItem("token", response.data.tokens.access_token)
            this.setAuth(true);
            this.setUser(response.data.user);
            return [true]
        }
        catch (e){

            if(e.response.status === 401){
                console.log(e)
                return [false, e.response?.data]
            }
            console.log(e.response?.data)
            throw e
        }
    }

    async registration(email:string,nickname:string, password: string){
        try{
            const response = await AuthService.registration(nickname,email,password);
            return response
        }
        catch (e){
            console.log(e.response?.data)
            throw e
        }
    }

    async logout(){
        try{
            const response = await AuthService.logout();
            localStorage.removeItem("token");
            this.setAuth(false)
            this.setUser({} as IUser)
        }
        catch (e){
            console.log(e.response?.data?.message)
            throw e
        }
    }
    async checkAuth(){
        try {
            const response = await  axios.post<AuthResponse>(`${API_URL}/refresh`,{},{withCredentials:true})
            console.log(response.data)
            localStorage.setItem("token", response.data.tokens.access_token)
            this.setAuth(true);
            this.setUser(response.data.user);
            return [true]
        }catch (e) {
            
        }
    }

}