import React, {FC, memo, useEffect, useState} from 'react';
import {IPost} from "../../../types/IPost";
import classes from "./PostSmallExample.module.css"
import LikeCounter from "../LikeCounter/LikeCounter";
import CommentsCounter from "../CommentsCounter/CommentsCounter";
import PostsTags from "../PostsTags/PostsTags";
import SavePostButton from "../SavePostButton/SavePostButton";

interface PostSmallExampleProps{
    post: IPost;
    navigator: any;
}


const PostSmallExample:FC<PostSmallExampleProps> = ({post, navigator}) => {

    const [isReadMore, setIsReadMore] = useState(false)

    useEffect(()=>{
        if(post.content.length>800){
            setIsReadMore(true)
        }
    }, [])

    const tagRedirect = (tag:string) => {
        const url = `/ticker/${tag.slice(1).toLowerCase()}`
        console.log(url)
        navigator(url)

    }

    return (

        <div className={classes.post_container}>
            <div className={classes.post_text}>
                {isReadMore?post.content.slice(0, 800):post.content}
                {isReadMore?<div className={classes.read_more} onClick={()=>setIsReadMore(false)}>read more</div>:null}
            </div>
            <PostsTags tags={post.tags} tagRedirect={tagRedirect}/>
            <div className={classes.buttons_bottom_container}>
                <div className={classes.buttons_bottom_right_container}>
                    <CommentsCounter CommentCount={post.comments}/>
                    <SavePostButton postId={post.id} isSaved={post.is_saved}/>
                </div>
                <div>
                    <LikeCounter count={Number(post.likes)} postId={post.id} LikeInit={post.like_initial}/>
                </div>
            </div>
        </div>
    );
};

export default memo(PostSmallExample);