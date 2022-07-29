import api from "../../http";
import {AxiosResponse} from 'axios'
import {ITickerDescription} from "../../types/ITickerDescription";
import {ITickerChar} from "../../types/ITickerChar";
import {IDayPrice} from "../../types/IDayPrice";
import {IGetDayPriceTicker} from "../../types/IGetDayPriceTicker";
import {IDashboardElem} from "../../types/IDashboardElem";
import {IUser} from "../../types/IUser";


export default class StocksServices{


    static async GetTickerDescription(ticker: string): Promise<AxiosResponse<ITickerDescription>>{
        return api.post<ITickerDescription>("/get_posts", {
            "ticker": ticker,
        })
    }

    static async GetTickerChar(ticker: string, period: string, interval:string): Promise<AxiosResponse<ITickerChar>>{

        return api.post<ITickerChar>("/get_char", {
            "ticker": ticker,
            "period":period,
            "interval": interval
        })
    }

    static async GetDayPrice(tickerArr:IGetDayPriceTicker): Promise<AxiosResponse<IDayPrice>>{
        const resp = await api.post<IDayPrice>("/get_price", tickerArr)
        return resp
    }

    static async GetTickerSearch(symbol: string): Promise<AxiosResponse<ITickerDescription[]>>{

        return api.post<ITickerDescription[]>("/ticker_search", {
            "symbol": symbol,
        })
    }

    static async GetUserDashboard(user: IUser): Promise<AxiosResponse<IDashboardElem[]>>{

        return api.post<IDashboardElem[]>("/get_dashboard", {
            "user": user,
        })
    }

    static async GetSyncUserDashboard(user: IUser, dashboard: IDashboardElem[]): Promise<AxiosResponse<boolean>>{

        return api.post<boolean>("/sync_dashboard", {
            "user": user,
            "tickers": dashboard
        })
    }






}