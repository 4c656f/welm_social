import React, {memo, useContext, useEffect, useState} from 'react';
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
import {Reorder} from "framer-motion";
import {useStores} from "../../../store";

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
    const [dashboardElemsLen,setDashboardElemsLen] = useState(0 )
    const [stockAmountState, setStockAmountState] = useState(false)
    const [isToggles, setIsToggles] = useState(true)
    const [isPercent, setIsPercent]= useState(false)
    const [dashboardFullPrice, setDashboardFullPrice] = useState({}as{open:string|number, close:string|number})
    const [period, setPeriod] = useState<IGetDayPriceTicker["period"]>("1d")
    const {UserStore, StockStore} = useStores();

    useEffect(()=>{
        if (UserStore.isLoading)return;

        const callback = async ()=>{
            const data = await StockStore.firstSetDashboard()

            setDashboardElems(data)
        }
        callback()

    },[UserStore.isLoading])

    useEffect(()=>{

        if (UserStore.isLoading)return;
        setDashboardElemsLen(dashboardElems.length)
        StockStore.syncDashboard(dashboardElems)
    },[dashboardElems, stockAmountState])

    const {isLoadingPrice, dayPrice} = useFetchDayPrice(dashboardElems, period, false, dashboardElemsLen)


    useEffect(()=>{
        // console.log(dayPrice)
    }, [dayPrice])



    useEffect(()=>{
        if(isLoadingPrice)return
        if(dashboardElems.length<1){
            setDashboardFullPrice({"open":0, "close": 0})
            return;
        };
        let open = 0
        let close = 0

        dashboardElems.map((val)=>{

            open += dayPrice[val.ticker]["open"] * val.amount
            close += dayPrice[val.ticker]["close"] * val.amount
        })
        setDashboardFullPrice({"open":open.toFixed(2), "close": close.toFixed(2)})
    }, [dayPrice, stockAmountState, dashboardElemsLen])


    return (
        <div className={classes.main_container}>
            <div className={classes.content_container}>
                <Selector initState={"day"} options={periodOptions} setFc={setPeriod}/>
                <PriceLabel price={dashboardFullPrice} isPercent={isPercent} setIsPercent={setIsPercent} isLoading={isLoadingPrice}/>


                <Reorder.Group as="div" className={"cards_active_container"} axis="y" values={dashboardElems} onReorder={setDashboardElems}>
                    {
                        dashboardElems.map((value, id) =>{
                            return(
                            <CardExemplar
                                toggles={isToggles}
                                ticker={value.ticker}
                                dashboardElem={value}
                                setDashboardElems={setDashboardElems}
                                key={value.ticker}
                                id={id}
                                setStockAmountState={setStockAmountState}
                            >
                                <PriceLabel
                                    price={dayPrice[value.ticker]}
                                    isLoading={isLoadingPrice}
                                    setIsPercent={setIsPercent}
                                    isPercent={isPercent}
                                />
                            </CardExemplar>)

                            }
                        )
                    }
                </Reorder.Group>


            </div>

        </div>
    );
};

export default memo(observer(UserDashboard));