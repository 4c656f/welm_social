import React, {FC, useEffect, useState} from 'react';
import classes from "./TickerDashbardPriceLabel.module.css";
import {IDayPrice} from "../../../types/IDayPrice";
import StocksServices from "../../../services/stocksServices/StocksServices";

interface TickerDashboardPriceLabelProps{
    ticker:string;
}


const TickerDashboardPriceLabel:FC<TickerDashboardPriceLabelProps> = ({ticker}) => {

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [priceChange, setPriceChange] = useState({"open":0, "close":0})
    const [isPercent, setIsPercent] = useState(false)
    const [lightClass, setLightClass] = useState(0)

    useEffect(()=>{

        const GetDayPrice = async () => {
            const data = await StocksServices.GetDayPrice([{"ticker":ticker}])
            setIsLoading(false)
            if(data.data[ticker]["close"]>data.data[ticker]["open"]){
                setLightClass(1)
            }else if(data.data[ticker]["close"]<data.data[ticker]["open"]){
                setLightClass(-1)
            }
            setTimeout(() => {
                setLightClass(0)
            }, 500)

            setPriceChange(data.data[ticker])

        }
        GetDayPrice()
        setInterval(() => {
            GetDayPrice()

        }, 60000);




    },[])



    useEffect(()=>{
        console.log(priceChange)
    },[priceChange])



    return (
        <div className={`${isLoading?"loader_bg":""} ${classes.price_wrapper} `}>
            <div className={classes.current_price} >
                {priceChange["close"]}

            </div>
            <div className={`${classes.price_change}
                ${lightClass>0?classes.light_positive:lightClass<0?classes.light_negative:""}
                ${priceChange["close"]>priceChange["open"]?classes.price_change_positive:classes.price_change_negative}`}
                 onClick={()=> setIsPercent((prev)=>!prev)}

            >{
                isPercent?(priceChange["close"]/priceChange["open"]*100-100).toFixed(2)+"%":(priceChange["close"]-priceChange["open"]).toFixed(2)+"$"
            }</div>
        </div>
    );
};

export default TickerDashboardPriceLabel;