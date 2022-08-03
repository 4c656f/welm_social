import React, {FC, useContext, useEffect} from 'react';
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import TickerPage from "./pages/TickerPage";
import "./utils/styles/pages/index.css"
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";
import TopBar from "./layouts/TopBar/TopBar";
import LeftBar from "./layouts/LeftBar/LeftBar";
import Dashboard from "./pages/Dashboard";
import SavedPosts from "./pages/SavedPosts";
import LoginModal from "./layouts/LoginModal/LoginModal";
import FullPost from "./pages/FullPost";
import PrivateAuthTrue from "./components/hocs/PrivateAuthTrue/PrivateAuthTrue";
import PrivateAuthFalse from "./components/hocs/PrivateAuthFalse/PrivateAuthFalse";
import {useStores} from "./store";


const App: FC  = () => {

    const {UserStore, StockStore} = useStores();



    useEffect(()=>{
        if(localStorage.getItem("token")){
            UserStore.checkAuth()
        }else {
            UserStore.setIsLoading(false);
        }

    },[])



    return (

        <BrowserRouter>
            <TopBar/>
            <LeftBar/>
            {UserStore.isModal?
                <LoginModal/>
                :null}
            <Routes>


                <Route path="/" element={<Home />}/>
                <Route path="/post/:postLink" element={<FullPost/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/saved-posts" element={<PrivateAuthFalse redirectTo={"/"}><SavedPosts/></PrivateAuthFalse>}/>
                <Route path="/sign-in" element={<PrivateAuthTrue redirectTo={"/"}><SignIn/></PrivateAuthTrue>}/>
                <Route path="/sign-up" element={<PrivateAuthTrue redirectTo={"/"}><SignUp/></PrivateAuthTrue>}/>
                <Route path="/ticker/:ticker" element={<TickerPage/>}/>
                <Route path="/not-found" element={<NotFound/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default observer(App);