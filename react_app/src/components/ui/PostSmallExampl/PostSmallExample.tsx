import React, {FC, memo, useEffect, useState} from 'react';
import {IPost} from "../../../types/IPost";
import classes from "./PostSmallExample.module.css"
import LikeCounter from "./LikeCounter/LikeCounter";

interface PostSmallExampleProps{
    post: IPost
}


const PostSmallExample:FC<PostSmallExampleProps> = ({post}) => {

    const [isReadMore, setIsReadMore] = useState(false)

    useEffect(()=>{
        if(post.content.length>400){
            setIsReadMore(true)
        }
    }, [])

    return (

        <div className={classes.post_container}>
            <div className={classes.post_text}>
                {isReadMore?post.content.slice(0, 400):post.content}
                {isReadMore?<div className={classes.read_more} onClick={()=>setIsReadMore(false)}>read more</div>:null}
            </div>
            <LikeCounter count={Number(post.likes)} postId={post.id} LikeInit={post.like_initial}/>

        </div>
    );
};

export default memo(PostSmallExample);