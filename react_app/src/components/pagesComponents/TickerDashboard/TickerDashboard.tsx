import React, {FC, useContext, useState} from 'react';
import useFetchChar from "../../../hooks/useFetchChar";
import Chart from "../../ui/Chart/Chart";
import Switcher from "../../ui/Switcher/Switcher";
import classes from "./TickerDashboard.module.css";
import TickerDashboardPriceLabel from "../../ui/TickerDashboardPriceLabel/TickerDashboardPriceLabel";
import Button from "../../ui/Button/Button";
import PostsFeed from "../../ui/PostsFeed/PostsFeed";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";


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
    const {store} = useContext(Context)


    return (
        <div className={"scroll_container"}>
            <div className={classes.name_price_wrapper}>
                <div>name</div>
                <TickerDashboardPriceLabel ticker={ticker}/>
            </div>
            <Chart char_data={data} isLoading={isLoading} />
            <div className={classes.switcher_container}>
                <Switcher buttonObject={periodSwitcher} setButtonsFc={setPeriodSwitcher} setValFc={setPeriodVal} placeholder={"Period"}/>
                <Switcher buttonObject={intervalSwitcher} setButtonsFc={setIntervalSwitcher} setValFc={setIntervalVal} placeholder={"Interval"}/>
                <Button onClick={()=>{store.addDashboardElem(ticker)}} content={"add to dashboard"}/>
            </div>
            <PostsFeed ticker={ticker}/>
        </div>
    );
};

export default observer(TickerDashboard);