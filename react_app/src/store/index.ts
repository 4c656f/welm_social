import UserStore from "./userStore";
import StockStore from "./stockStore";
import {createContext, useContext} from "react";
import {IRootStore} from "../types/IRotStore";


class RootStore {

    UserStore:UserStore
    StockStore:StockStore

    constructor() {
        this.UserStore = new UserStore(this)
        this.StockStore = new StockStore(this)
    }

}


const StoresContext = createContext(new RootStore());

export const useStores:()=>IRootStore = () => useContext(StoresContext);