import React, {useContext, useEffect, useState} from 'react';
import classes from "./LikeCounter.module.css"
import { ReactComponent as LikeSvg } from "../../../../utils/svg/like.svg"
import {observer} from "mobx-react-lite";
import {Context} from "../../../../index";
import PostsServices from "../../../../services/postsServices/PostsService"

interface LikeCounterProps{
    count:number;
    postId:number;
}

const LikeCounter = ({count, postId}) => {

    const [likeCount, setLikeCount] = useState<number>(count)
    const [likeType, setLikeType] = useState<number>(0)



    const {store} = useContext(Context)
    const addLike = async (type) => {
        console.log(type)
        if(!store.isAuth){
            //PopUp
            console.log("пользователь не авторизован")
            return
        }
        const likeResp = await PostsServices.AddLike(store.user,type,postId)
        if(likeResp.data){
            setLikeType(type)
        }else{
            console.log("error")
        }

    }

    return (
        <div className={classes.like_counter_wrap}>
            <div className={classes.dislike_button} onClick={()=>addLike(-1)}>
                <LikeSvg/>
            </div>

            <div className={`${classes.like_number} ${likeCount>0? classes.like_number_positive: likeCount<0?classes.like_number_negative: ""}`}>
                {likeCount + likeType}
            </div>
            <div className={classes.like_button} onClick={()=>addLike(1)}>
                <LikeSvg/>
            </div>
        </div>
    );
};

export default observer(LikeCounter);