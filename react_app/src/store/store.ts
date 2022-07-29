import {IUser} from "../types/IUser";
import {makeAutoObservable} from "mobx";
import AuthService from "../services/userServices/AuthService";
import axios from "axios";
import {API_URL} from "../http";
import {AuthResponse} from "../types/AuthResponse";
import {IDashboardElem} from "../types/IDashboardElem";
import StocksServices from "../services/stocksServices/StocksServices";


export default class Store{

    user = {} as IUser;
    isAuth = false;
    isLoading = true;
    dashboardElems = [] as IDashboardElem[]

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool:boolean){
        this.isAuth = bool;
    }
    setUser(user: IUser){
        this.user = user;
    }

    addDashboardElem(ticker:string){
        if (this.dashboardElems.some((elem) => elem["ticker"] === ticker))return
        console.log("добавление")
        const curAdd = {"id": null, "user_id": null, "ticker": ticker, "amount": 1}
        this.dashboardElems.push(curAdd)
        const prevLocalStorage = JSON.parse(localStorage.getItem("dashboard"))
        localStorage.setItem("dashboard", JSON.stringify([...prevLocalStorage, curAdd]))

        if(!this.isAuth)return;
        StocksServices.GetSyncUserDashboard(this.user, this.dashboardElems)
    }
    firstSetDashboard(){

    }

    async login(email:string, password: string){
        try{
            this.isLoading = true
            const response = await AuthService.login(email,password);
            localStorage.setItem("token", response.data.tokens.access_token)
            this.setAuth(true);
            this.setUser(response.data.user);
            this.isLoading = false
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
            this.isLoading = true
            const response = await  axios.post<AuthResponse>(`${API_URL}/refresh`,{},{withCredentials:true})
            localStorage.setItem("token", response.data.tokens.access_token)
            this.setAuth(true);
            this.setUser(response.data.user);
            return [true]
        }catch (e) {
            console.log(e)
            
        }finally {
            this.isLoading = false
        }
    }

}