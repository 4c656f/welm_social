import StockStore from "../store/stockStore"
import UserStore from "../store/userStore"

export interface IRootStore {
    UserStore: UserStore
    StockStore:StockStore
}