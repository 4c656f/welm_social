import React, {FC, useContext, useEffect} from 'react';
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import TickerPage from "./pages/TickerPage";
import "./utils/styles/pages/index.css"
import {Context} from "./index";
import {observer} from "mobx-react-lite";


const App: FC  = () => {

    const {store} = useContext(Context)

    useEffect(()=>{
        if(localStorage.getItem("token")){
            store.checkAuth()
        }

    },[])

    return (
        <BrowserRouter>
            <Routes>


                <Route path="/" element={<Home />}/>
                <Route path="/sign-in" element={<SignIn/>}/>
                <Route path="/sign-up" element={<SignUp/>}/>
                <Route path="/ticker/:ticker" element={<TickerPage/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default observer(App);