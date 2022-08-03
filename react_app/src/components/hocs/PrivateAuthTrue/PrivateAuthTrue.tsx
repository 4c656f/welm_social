import React, {useEffect} from 'react';
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {useStores} from "../../../store";


const PrivateAuthTrue = ({children, redirectTo}) => {


    const {UserStore} = useStores();
    const navigator = useNavigate()

    useEffect(()=>{
        if(UserStore.isLoading)return;
        if(!UserStore.isAuth)return
        navigator(redirectTo)
    },[UserStore.isLoading])


    return (
        !UserStore.isAuth ? children : null
    );
};

export default observer(PrivateAuthTrue);