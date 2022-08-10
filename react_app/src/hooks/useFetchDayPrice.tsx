import {useEffect, useState} from "react";
import StocksServices from "../services/stocksServices/StocksServices";
import {IDashboardElem} from "../types/IDashboardElem";
import {IDayPrice} from "../types/IDayPrice";
import {IGetDayPriceTicker} from "../types/IGetDayPriceTicker";


interface ticker {
    ticker:string
}



const useFetchDayPrice = (tickers:IDashboardElem[]|ticker[], period:IGetDayPriceTicker["period"], isOneElem:boolean, tickersLen?:number, isDashboardFetching?:boolean) => {

    const [isLoadingPrice, setIsisLoadingPrice] = useState<boolean>(true)
    const [dayPrice, setDayPrice] = useState<IDayPrice|IDayPrice[string]>({} as IDayPrice|IDayPrice[string])



    useEffect(()=>{

        if(isDashboardFetching)return
        if(tickers.length<1) {

            setIsisLoadingPrice(false)
            return
        };
        if(!period)return;


        const GetDayPrice = async () => {
            console.log("hook_GetDayPrice_fetch---------")
            const data = await StocksServices.GetDayPrice({"tickers": tickers, "period":period})


            if(isOneElem){
                const keys = Object.keys(data.data)
                setIsisLoadingPrice(false)
                setDayPrice(data.data[keys[0]])
                return
            }


            setDayPrice(data.data)



            setIsisLoadingPrice(false)

        }
        GetDayPrice()
        const interval = setInterval(() => {
            GetDayPrice()
        }, 30000);

        return ()=> clearInterval(interval)

    },[tickersLen?tickersLen:tickers, period, isDashboardFetching])


    return {isLoadingPrice, dayPrice, setDayPrice}

}

export default useFetchDayPrice