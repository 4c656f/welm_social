import React, {useState} from 'react';
import classes from "./LikeCounter.module.css"
import {ReactComponent as LikeSvg} from "../../../utils/svg/like.svg"
import {observer} from "mobx-react-lite";
import PostsServices from "../../../services/postsServices/PostsService"
import {useStores} from "../../../store";

interface LikeCounterProps{
    count:number;
    postId:number;
}

const LikeCounter = ({count, postId, LikeInit}) => {

    const [likeCount, setLikeCount] = useState<number>(count - LikeInit)
    const [likeType, setLikeType] = useState<number>(LikeInit)



    const {UserStore} = useStores();


    const likeWrap = (type) => {
        const addLike = async () => {
            console.log(type)
            if(!UserStore.isAuth){
                console.log("пользователь не авторизован")
                return
            }
            let cur_type = type
            if(type === likeType)cur_type = 0

            const likeResp = await PostsServices.AddLike(UserStore.user,cur_type,postId)
            if(likeResp.data){
                setLikeType(cur_type)
            }else{
                console.log("error")
            }

        }
        return addLike
    }


    return (
        <div className={classes.like_counter_wrap}>
            <div className={`${classes.dislike_button} ${likeType===-1?classes.active_button:""}`} onClick={()=>UserStore.privateModalWrapper(likeWrap(-1))}>
                <LikeSvg/>
            </div>

            <div className={`${classes.like_number} ${(likeCount + likeType)>0?classes.like_number_positive:(likeCount + likeType)<0?classes.like_number_negative:""}`}>
                {likeCount + likeType}
            </div>
            <div className={`${classes.like_button} ${likeType===1?classes.active_button:""}`} onClick={()=>UserStore.privateModalWrapper(likeWrap(1))}>
                <LikeSvg/>
            </div>
        </div>
    );
};

export default observer(LikeCounter);