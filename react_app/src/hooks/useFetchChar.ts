import {ITickerChar} from "../types/ITickerChar";
import StocksServices from "../services/stocksServices/StocksServices";
import {useEffect, useState} from "react";



const useFetchChar = (ticker:string, interval:string, period:string) =>{

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [data, setData] = useState<ITickerChar>(null)


    useEffect(()=>{
        setIsLoading(true)
        StocksServices.GetTickerChar(ticker, period, interval).then((resp)=>{
            setData(resp.data)
        }).finally(()=>setIsLoading(false))
    },[interval, period])



    return {isLoading, data}

}

export default useFetchChar