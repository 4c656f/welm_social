import {makeAutoObservable} from "mobx";
import {IDashboardElem} from "../types/IDashboardElem";
import StocksServices from "../services/stocksServices/StocksServices";
import {IRootStore} from "../types/IRotStore";





class StockStore{


    dashboardElems = [] as IDashboardElem[]
    RootStore:IRootStore

    constructor(RootStore) {
        this.RootStore = RootStore
        makeAutoObservable(this);
    }




    addDashboardElem(ticker:string){
        if (this.dashboardElems.some((elem) => elem["ticker"] === ticker))return
        console.log("добавление")
        const curAdd = {"id": null, "user_id": null, "ticker": ticker, "amount": 1}
        this.dashboardElems.push(curAdd)
        const prevLocalStorage = JSON.parse(localStorage.getItem("dashboard"))
        localStorage.setItem("dashboard", JSON.stringify([...prevLocalStorage, curAdd]))

        if(!this.RootStore.UserStore.isAuth)return;
        StocksServices.GetSyncUserDashboard(this.RootStore.UserStore.user, this.dashboardElems)
    }
    syncDashboard(elems:IDashboardElem[]){
        this.dashboardElems = elems
        localStorage.setItem("dashboard", JSON.stringify(elems))
        if(!this.RootStore.UserStore.isAuth)return;
        StocksServices.GetSyncUserDashboard(this.RootStore.UserStore.user, elems)
    }

    firstSetDashboard(){
        if(!this.RootStore.UserStore.isAuth){
            if(JSON.parse(localStorage.getItem("dashboard"))){

                const local = JSON.parse(localStorage.getItem("dashboard"))
                this.dashboardElems = local

                return local
            }

        }
        const dashboardFromCloud = async () =>{
            const resp = await StocksServices.GetUserDashboard(this.RootStore.UserStore.user);
            localStorage.setItem("dashboard", JSON.stringify(resp.data));
            this.dashboardElems = resp.data
            return resp.data
        }
        return dashboardFromCloud()
    }


}

export default StockStore