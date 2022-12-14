import {ITickerCharData} from "../types/ITickerChar";
import StocksServices from "../services/stocksServices/StocksServices";
import {useEffect, useState} from "react";


const useFetchChar = (ticker:string, interval:string, period:boolean|"1d"|"1mo"|"1y") =>{

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [data, setData] = useState<ITickerCharData[]>(null)


    useEffect(()=>{
        setIsLoading(true)
        StocksServices.GetTickerChar(ticker, period, interval).then((resp)=>{
            setData(resp.data[ticker])
        }).catch((val)=>console.log(val)).finally(()=>setIsLoading(false))
    },[interval, period, ticker])



    return {isLoading, data}

}

export default useFetchChar