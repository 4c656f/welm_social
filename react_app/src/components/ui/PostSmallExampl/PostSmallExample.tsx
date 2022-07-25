import React, {FC, memo, useEffect} from 'react';
import {IPost} from "../../../types/IPost";
import classes from "./PostSmallExample.module.css"
import LikeCounter from "./LikeCounter/LikeCounter";

interface PostSmallExampleProps{
    post: IPost
}


const PostSmallExample:FC<PostSmallExampleProps> = ({post}) => {


    useEffect(()=>{
        console.log(post)
    }, [])

    return (

        <div className={classes.post_container}>
            <div className={classes.title}>
                {post.title}
            </div>
            <div className={classes.post_text}>
                {post.content}
            </div>
            <LikeCounter count={Number(post.likes)} postId={post.id} LikeInit={post.like_initial}/>

        </div>
    );
};

export default memo(PostSmallExample);