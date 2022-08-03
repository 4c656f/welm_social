import {IUser} from "../types/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/userServices/AuthService";
import axios from "axios";
import {AuthResponse} from "../types/AuthResponse";
import {API_URL} from "../http";
import {IRootStore} from "../types/IRotStore";


class UserStore{

    user = {} as IUser;
    isAuth = false;
    isLoading = true;
    isModal = false;
    RootStore:IRootStore

    constructor(RootStore) {
        this.RootStore = RootStore
        makeAutoObservable(this);
    }

    setAuth(bool:boolean){
        this.isAuth = bool;
    }
    setUser(user: IUser){
        this.user = user;
    }
    setIsLoading(bool:boolean){
        this.isLoading = bool
    }


    async login(email:string, password: string){
        try{
            this.setIsLoading(true)
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
        }finally {
            this.setIsLoading(false)
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
            this.setIsLoading(true)

            const response = await  axios.post<AuthResponse>(`${API_URL}/refresh`,{},{withCredentials:true})
            localStorage.setItem("token", response.data.tokens.access_token)
            this.setAuth(true);
            this.setUser(response.data.user);
            return [true]
        }catch (e) {
            console.log(e)

        }finally {
            this.setIsLoading(false)
        }
    }

    privateModalWrapper(fc){
        if(!this.isAuth){
            this.isModal= true
            return
        }
        return fc()
    }

}


export default UserStore