import React, {memo, useContext, useEffect, useState} from 'react';
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
import {IDashboardElem} from "../../../types/IDashboardElem";
import StocksServices from "../../../services/stocksServices/StocksServices";
import {IDayPrice} from "../../../types/IDayPrice";




const UserDashboard = () => {

    const [dashboardElems, setDashboardElems] = useState<IDashboardElem[]>([] as IDashboardElem[])
    const [dashboardPrices, setDashboardPrices] = useState({}as IDayPrice)
    const {store} = useContext(Context)


    useEffect(()=>{
        if (store.isLoading)return;
        if(!store.isAuth){
            if(JSON.parse(localStorage.getItem("dashboard"))){
                setDashboardElems(JSON.parse(localStorage.getItem("dashboard")))
            }
            return
        }

        const dashboardFromCloud = async () =>{
            const resp = await StocksServices.GetUserDashboard(store.user);
            localStorage.setItem("dashboard", JSON.stringify(resp.data))
            setDashboardElems(resp.data);
        }
        dashboardFromCloud()


    },[store.isLoading])

    useEffect(()=>{
        if(dashboardElems.length<1)return
        const req = async ()=>{
            const resp = await StocksServices.GetDayPrice({"tickers": dashboardElems, "period":false});
            setDashboardPrices(resp.data)
        }
        req()
    }, [dashboardElems])

    useEffect(()=>{
        console.log(dashboardPrices)
    }, [dashboardPrices])

    return (
        <div>
            
        </div>
    );
};

export default memo(observer(UserDashboard));