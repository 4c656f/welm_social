import React, {memo, useContext, useEffect, useState} from 'react';
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
import {IDashboardElem} from "../../../types/IDashboardElem";
import StocksServices from "../../../services/stocksServices/StocksServices";
import {IDayPrice} from "../../../types/IDayPrice";
import {IGetDayPriceTicker} from "../../../types/IGetDayPriceTicker";
import Selector from "../../ui/Selector/Selector";
import classes from "./UserDashboard.module.css";
import CardExemplar from "./CardExemplar/CardExemplar";
import PriceLabel from "../../ui/PriceLabel/PriceLabel";
import useFetchDayPrice from "../../../hooks/useFetchDayPrice";

const periodOptions = [
    {
        "optionText": "day",
        "value": "1d"
    },
    {
        "optionText": "month",
        "value": "1mo"
    },
    {
        "optionText": "year",
        "value": "1y"
    },
    {
        "optionText": "max",
        "value": "max"
    },
]


const UserDashboard = () => {

    const [dashboardElems, setDashboardElems] = useState<IDashboardElem[]>([] as IDashboardElem[])
    const [dashboardElemsLen,setDashboardElemsLen] = useState(0)

    const [isPercent, setIsPercent]= useState(false)
    const [dashboardFullPrice, setDashboardFullPrice] = useState({}as{open:number, close:number})
    const [period, setPeriod] = useState<IGetDayPriceTicker["period"]>("1d")
    const {store} = useContext(Context)


    useEffect(()=>{
        if (store.isLoading)return;

       store.firstSetDashboard().then((val)=>{
           setDashboardElems(val)
       })
    },[store.isLoading])

    useEffect(()=>{
        setDashboardElemsLen(dashboardElems.length)
    },[dashboardElems])

    const {isLoadingPrice, dayPrice} = useFetchDayPrice(dashboardElems, period, false, dashboardElemsLen)


    useEffect(()=>{
        let open = 0
        let close = 0
        dashboardElems.map((val)=>{
            open += dayPrice[val.ticker]["open"] * val.amount
            close += dayPrice[val.ticker]["close"] * val.amount
        })
        setDashboardFullPrice({"open":open, "close": close})
    }, [dayPrice])

    return (
        <div className={classes.main_container}>
            <div className={classes.content_container}>
                <Selector initState={"day"} options={periodOptions} setFc={setPeriod}/>
                <PriceLabel price={dashboardFullPrice} isPercent={isPercent} setIsPercent={setIsPercent} isLoading={isLoadingPrice}/>
                <div className={classes.card_container}>
                    {
                        dashboardElems.map((val)=>{
                            return (
                                <PriceLabel key={val.ticker} price={dayPrice[val.ticker]} isLoading={isLoadingPrice} setIsPercent={setIsPercent} isPercent={isPercent}/>
                            )
                        })
                    }
                </div>
            </div>

        </div>
    );
};

export default memo(observer(UserDashboard));