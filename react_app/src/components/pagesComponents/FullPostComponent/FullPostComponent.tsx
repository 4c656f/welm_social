import React, {FC, useEffect, useState} from 'react';
import {IFullPost} from "../../../types/IFullPost";
import PostsService from "../../../services/postsServices/PostsService";
import {observer} from "mobx-react-lite";
import PostSmallExample from "../../ui/PostSmallExampl/PostSmallExample";
import {useNavigate} from "react-router-dom";
import classes from "./FullPostComponent.module.css"
import CommentsFullBlock from "../../ui/CommentsFullBlock/CommentsFullBlock";
import {useStores} from "../../../store";

interface FullPostComponentProps {
    postLink:string
}


const FullPostComponent:FC<FullPostComponentProps> = ({postLink}) => {


    const [post, setPost] = useState<IFullPost[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const {UserStore, StockStore} = useStores();


    useEffect(()=>{
        if(UserStore.isLoading)return;
        const callback =async ()  =>{
            const resp = await PostsService.GetFullPost(UserStore.isAuth?UserStore.user:false, postLink)
            setPost(resp.data)
            setIsLoading(false)
        }
        callback()

    }, [postLink, UserStore.isLoading])

    const navigator = useNavigate()



    return (
        <div className={classes.main_container}>
            {!isLoading?
                <>
                    <PostSmallExample post={post[0]} navigator={navigator} isFull={true}/>
                    <CommentsFullBlock comments={post[0]["comments_full"]} postId={post[0]["id"]}/>
                </>
                :
                null
            }
        </div>
    );
};

export default observer(FullPostComponent);