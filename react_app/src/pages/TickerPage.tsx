import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import TickerDashboard from "../components/pagesComponents/TickerDashboard/TickerDashboard";



type urlParams = {
    ticker:string;
}

const TickerPage = () => {

    let {ticker} = useParams<urlParams>();



    return (
        <>
            <TickerDashboard ticker={ticker.toUpperCase()}/>
        </>
    );
};

export default TickerPage;