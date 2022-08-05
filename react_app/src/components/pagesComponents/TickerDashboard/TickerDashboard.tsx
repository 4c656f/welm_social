import React, {FC, memo, useCallback, useEffect, useState} from 'react';
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
    const [periodVal, setPeriodVal] = useState<boolean|"1d"|"1mo"|"1y">("1mo")
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

    const [tooltipOpen, setTooltipOpen] = useState()

    const [isTooltip, setIsTooltip] = useState<boolean>(false)




    useEffect(()=>{
        setTickerArr([{"ticker": ticker}])
    },[ticker])

    const{isLoadingPrice, dayPrice, setDayPrice} = useFetchDayPrice(tickerArr, periodVal, true)


    useEffect(()=>{
        console.log(dayPrice)
    },[dayPrice])


    const storeUpdate = useCallback(()=>StockStore.addDashboardElem(ticker),[ticker])

    return (
        <div className={"scroll_container"}>
            <div className={classes.name_price_wrapper}>
                <div>name</div>
                <PriceLabel price={dayPrice} isPercent={isPercent} setIsPercent={setIsPercent} isLoading={isLoadingPrice} isTooltip={isTooltip} tooltipOpen={tooltipOpen}/>
            </div>
            <Chart char_data={data} isLoading={isLoading} setTooltipOpen={setTooltipOpen} setIsTooltip={setIsTooltip} />
            <div className={classes.switcher_container}>
                <Switcher buttonObject={periodSwitcher} setButtonsFc={setPeriodSwitcher} setValFc={setPeriodVal} placeholder={"Period"}/>
                <Switcher buttonObject={intervalSwitcher} setButtonsFc={setIntervalSwitcher} setValFc={setIntervalVal} placeholder={"Interval"}/>
                <Button onClick={storeUpdate} content={"add to dashboard"}/>
            </div>
            <PostsFeed ticker={ticker}/>
        </div>
    );
};

export default observer(TickerDashboard);