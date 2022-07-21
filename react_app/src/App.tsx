import React, {FC} from 'react';
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import TickerPage from "./pages/TickerPage";
import "./utils/styles/pages/index.css"


const App: FC  = () => {

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

export default App;