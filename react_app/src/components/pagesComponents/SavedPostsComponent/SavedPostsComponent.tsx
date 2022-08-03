import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {IPost} from "../../../types/IPost";
import PostsService from "../../../services/postsServices/PostsService";
import PostSmallExample from "../../ui/PostSmallExampl/PostSmallExample";
import {observer} from "mobx-react-lite";
import classes from "./SavedPostsComponent.module.css"
import {useStores} from "../../../store";

const SavedPostsComponent = () => {


    const {UserStore, StockStore} = useStores();

    const navigator = useNavigate()

    const [posts, setPosts]= useState<IPost[]>([])
    const [isLoading, setIsLoading]= useState(true)

    useEffect(()=>{
        const callback = async () => {
            const resp = await PostsService.GetSavePost(UserStore.user)
            setPosts(resp.data)
            setIsLoading(false)
        }
        callback()
    },[])



    return (
        <div className={"scroll_container"}>
            {isLoading?
                null
                :
                posts.map((val)=>{
                    console.log(posts)
                    return (
                        <PostSmallExample key = {val.post_link} post={val} isFull={false} navigator={navigator}/>
                    )
                })}
        </div>
    );
};

export default observer(SavedPostsComponent);