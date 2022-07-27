import React, {memo, useContext, useEffect} from 'react';
import classes from "./TopBar.module.css";
import {Context} from "../../index";
import Button from "../../components/ui/Button/Button";
import {useNavigate} from "react-router-dom";
import TopBarSearch from "../../components/ui/TopBarSearch/TopBarSearch";
import {observer} from "mobx-react-lite";


const TopBar = () => {


    const {store} = useContext(Context)

    const navigator = useNavigate()



    return (
        <div className={classes.bar_wrapper}>
            <TopBarSearch/>
            {store.isAuth?
                <div className={classes.button_wrapper}>
                    <Button onClick={()=>{store.logout()}} content={"log out"}/>
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