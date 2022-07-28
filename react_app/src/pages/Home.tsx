import React, {FC, useContext} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import PostsMainPage from "../components/pagesComponents/PostsMainPage/PostsMainPage";

const Home:FC = () => {


    const {store} = useContext(Context)



    return (
        <div>
            <PostsMainPage/>

        </div>
    );
};

export default observer(Home);