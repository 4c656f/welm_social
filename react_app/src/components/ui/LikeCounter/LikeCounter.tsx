import React, {useContext, useEffect, useState} from 'react';
import classes from "./LikeCounter.module.css"
import { ReactComponent as LikeSvg } from "../../../utils/svg/like.svg"
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import PostsServices from "../../../services/postsServices/PostsService"

interface LikeCounterProps{
    count:number;
    postId:number;
}

const LikeCounter = ({count, postId, LikeInit}) => {

    const [likeCount, setLikeCount] = useState<number>(count - LikeInit)
    const [likeType, setLikeType] = useState<number>(LikeInit)



    const {store} = useContext(Context)

    const addLike = async (type) => {
        console.log(type)
        if(!store.isAuth){
            console.log("пользователь не авторизован")
            return
        }
        let cur_type = type
        if(type === likeType)cur_type = 0

        const likeResp = await PostsServices.AddLike(store.user,cur_type,postId)
        if(likeResp.data){
            setLikeType(cur_type)
        }else{
            console.log("error")
        }

    }


    return (
        <div className={classes.like_counter_wrap}>
            <div className={`${classes.dislike_button} ${likeType===-1?classes.active_button:""}`} onClick={()=>addLike(-1)}>
                <LikeSvg/>
            </div>

            <div className={`${classes.like_number} ${(likeCount + likeType)>0?classes.like_number_positive:(likeCount + likeType)<0?classes.like_number_negative:""}`}>
                {likeCount + likeType}
            </div>
            <div className={`${classes.like_button} ${likeType===1?classes.active_button:""}`} onClick={()=>addLike(1)}>
                <LikeSvg/>
            </div>
        </div>
    );
};

export default observer(LikeCounter);