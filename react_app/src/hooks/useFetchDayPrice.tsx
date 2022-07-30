import {useEffect, useState} from "react";
import StocksServices from "../services/stocksServices/StocksServices";
import {IDashboardElem} from "../types/IDashboardElem";
import {IDayPrice} from "../types/IDayPrice";
import {IGetDayPriceTicker} from "../types/IGetDayPriceTicker";


interface ticker {
    ticker:string
}



const useFetchDayPrice = (tickers:IDashboardElem[]|ticker[], period:IGetDayPriceTicker["period"], isOneElem:boolean, tickersLen?:number) => {

    const [isLoadingPrice, setIsisLoadingPrice] = useState<boolean>(true)
    const [dayPrice, setDayPrice] = useState<IDayPrice|IDayPrice[string]>({} as IDayPrice|IDayPrice[string])



    useEffect(()=>{
        if(tickers.length<1)return;


        const GetDayPrice = async () => {
            console.log("hook_fetch---------")
            const data = await StocksServices.GetDayPrice({"tickers": tickers, "period":period})
            setIsisLoadingPrice(false)
            if(isOneElem){
                const keys = Object.keys(data.data)
                setDayPrice(data.data[keys[0]])
                return
            }

            setDayPrice(data.data)


        }
        GetDayPrice()
        const interval = setInterval(() => {
            GetDayPrice()
        }, 5000);

        return ()=> clearInterval(interval)

    },[tickersLen?tickersLen:tickers, period])


    return {isLoadingPrice, dayPrice}

}

export default useFetchDayPrice