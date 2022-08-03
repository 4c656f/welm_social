import React, {memo, useContext, useEffect} from 'react';
import classes from "./TopBar.module.css";
import Button from "../../components/ui/Button/Button";
import {useNavigate} from "react-router-dom";
import TopBarSearch from "../../components/ui/TopBarSearch/TopBarSearch";
import {observer} from "mobx-react-lite";
import {useStores} from "../../store";


const TopBar = () => {


    const {UserStore, StockStore} = useStores();

    const navigator = useNavigate()



    return (
        <div className={classes.bar_wrapper}>
            <TopBarSearch/>
            {UserStore.isAuth?
                <div className={classes.button_wrapper}>
                    <Button onClick={()=>{UserStore.logout()}} content={"log out"}/>
                </div>
                :
                <div className={classes.button_wrapper}>
                    <Button onClick={()=>{navigator("/sign-in")}} content={"sign in"}/>
                    <Button onClick={()=>{navigator("/sign-up")}} content={"sign up"}/>
                </div>
            }
        </div>
    );
};

export default memo(observer(TopBar));