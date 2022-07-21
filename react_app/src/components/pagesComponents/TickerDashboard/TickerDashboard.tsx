import React, {FC, useEffect, useState} from 'react';
import useFetchChar from "../../../hooks/useFetchChar";
import Chart from "../../ui/Chart/Chart";
import Switcher from "../../ui/Switcher/Switcher";
import classes from "./TickerDashboard.module.css"
import Feed from "../../ui/Feed/Feed";


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



    return (
        <div className={"scroll_container"}>
            <Chart ticker={ticker} char_data={data} isLoading={isLoading}/>
            <div className={classes.switcher_container}>
                <Switcher buttonObject={periodSwitcher} setButtonsFc={setPeriodSwitcher} setValFc={setPeriodVal} placeholder={"Period"}/>
                <Switcher buttonObject={intervalSwitcher} setButtonsFc={setIntervalSwitcher} setValFc={setIntervalVal} placeholder={"Interval"}/>
            </div>
            <Feed type={"main"} ticker={ticker}/>
        </div>
    );
};

export default TickerDashboard;