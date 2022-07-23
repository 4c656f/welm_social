import React, {FC, useContext} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const Home:FC = () => {


    const {store} = useContext(Context)



    return (
        <div>
            {store.isAuth?
                <div style={{color:"white"}}>пользователь авторизован</div>:null
            }
            Home
        </div>
    );
};

export default observer(Home);