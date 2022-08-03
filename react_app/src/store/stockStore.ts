import {makeAutoObservable, toJS} from "mobx";
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

    setDashboardElems(elems:IDashboardElem[]){

        console.log(elems)
        this.dashboardElems = elems
    }



    addDashboardElem(ticker:string){
        if (this.dashboardElems.some((elem) => elem["ticker"] === ticker))return


        console.log("добавление")
        const curAdd = {"id": null, "sort_id":null, "user_id": null, "ticker": ticker, "amount": 1}
        this.dashboardElems = [curAdd, ...this.dashboardElems]
        localStorage.setItem("dashboard", JSON.stringify(this.dashboardElems))
        if(!this.RootStore.UserStore.isAuth)return;
        StocksServices.AddToDashboard(this.RootStore.UserStore.user, ticker)
    }


    syncDashboard(elems:IDashboardElem[]){
        this.dashboardElems = elems
        localStorage.setItem("dashboard", JSON.stringify(elems))
        if(!this.RootStore.UserStore.isAuth)return;
        StocksServices.GetSyncUserDashboard(this.RootStore.UserStore.user, elems)
    }

    firstSetDashboard(){
        if(!this.RootStore.UserStore.isAuth){
            console.log(this.RootStore.UserStore.isAuth)
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
    changeAmount(id, amount){

        this.dashboardElems[id]["amount"] = amount
        if(!this.RootStore.UserStore.isAuth){
            localStorage.setItem("dashboard", JSON.stringify(this.dashboardElems))
            return

        }
        return StocksServices.ChangeAmountDashboard(this.RootStore.UserStore.user, this.dashboardElems[id]["ticker"], amount)
    }


    deleteFromDashboard(id){
        let ticker = this.dashboardElems[id]["ticker"]
        console.log(id)


        this.dashboardElems = toJS(this.dashboardElems).filter((val, index)=>index !== id)

        if(!this.RootStore.UserStore.isAuth){
            localStorage.setItem("dashboard", JSON.stringify(this.dashboardElems))
            return
        }
        return StocksServices.DeleteFromDashboard(this.RootStore.UserStore.user, ticker)
    }
    reorderDashboard(reorderDashboard:IDashboardElem[]){
        if(!this.RootStore.UserStore.isAuth){
            localStorage.setItem("dashboard", JSON.stringify(this.dashboardElems))
            return

        }
        return StocksServices.SortDashboard(this.RootStore.UserStore.user, reorderDashboard)
    }

}

export default StockStore