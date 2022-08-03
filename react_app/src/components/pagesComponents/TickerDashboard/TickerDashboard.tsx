import React, {FC, useEffect, useState} from 'react';
import useFetchChar from "../../../hooks/useFetchChar";
import Chart from "../../ui/Chart/Chart";
import Switcher from "../../ui/Switcher/Switcher";
import classes from "./TickerDashboard.module.css";
import Button from "../../ui/Button/Button";
import PostsFeed from "../../ui/PostsFeed/PostsFeed";
import {observer} from "mobx-react-lite";
import useFetchDayPrice from "../../../hooks/useFetchDayPrice";
import PriceLabel from "../../ui/PriceLabel/PriceLabel";
import {useStores} from "../../../store";


interface TickerDashboardProps{
    ticker:string
}

const TickerDashboard:FC<TickerDashboardProps> = ({ticker}) => {

    const [periodSwitcher, setPeriodSwitcher] = useState([
       {
            "content": "1d",

                "isDisabled":false,
                "isActive":false,
        },
        {
            "content": "1mo",
                "isDisabled":true,
                "isActive":true,
        },
        {
            "content": "1y",
                "isDisabled":false,
                "isActive":false,
        }])
    const [periodVal, setPeriodVal] = useState<string>("1mo")
    const [intervalSwitcher, setIntervalSwitcher] = useState([
        {
            "content": "1h",
            "isDisabled":true,
            "isActive":true,
        },
        {
            "content": "1d",
            "isDisabled":false,
            "isActive":false,
        },
        {
            "content": "1mo",
            "isDisabled":false,
            "isActive":false,
        }])
    const [intervalVal, setIntervalVal] = useState<string>("1h")

    const {isLoading, data} = useFetchChar(ticker, intervalVal, periodVal)

    const {StockStore} = useStores();

    const [isPercent, setIsPercent] = useState(false)

    const [tickerArr, setTickerArr]= useState([{"ticker": ticker}])

    useEffect(()=>{
        setTickerArr([{"ticker": ticker}])
    },[ticker])

    const{isLoadingPrice, dayPrice} = useFetchDayPrice(tickerArr, "1d", true)




    return (
        <div className={"scroll_container"}>
            <div className={classes.name_price_wrapper}>
                <div>name</div>
                <PriceLabel price={dayPrice} isPercent={isPercent} setIsPercent={setIsPercent} isLoading={isLoadingPrice}/>
            </div>
            <Chart char_data={data} isLoading={isLoading} />
            <div className={classes.switcher_container}>
                <Switcher buttonObject={periodSwitcher} setButtonsFc={setPeriodSwitcher} setValFc={setPeriodVal} placeholder={"Period"}/>
                <Switcher buttonObject={intervalSwitcher} setButtonsFc={setIntervalSwitcher} setValFc={setIntervalVal} placeholder={"Interval"}/>
                <Button onClick={()=>{StockStore.addDashboardElem(ticker)}} content={"add to dashboard"}/>
            </div>
            <PostsFeed ticker={ticker}/>
        </div>
    );
};

export default observer(TickerDashboard);