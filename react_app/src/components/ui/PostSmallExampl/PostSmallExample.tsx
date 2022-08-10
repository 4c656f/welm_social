import React, {FC, memo, useEffect, useState} from 'react';
import {IPost} from "../../../types/IPost";
import classes from "./PostSmallExample.module.css"
import LikeCounter from "../LikeCounter/LikeCounter";
import CommentsCounter from "../CommentsCounter/CommentsCounter";
import PostsTags from "../PostsTags/PostsTags";
import SavePostButton from "../SavePostButton/SavePostButton";
import ReactHtmlParser from "react-html-parser";
import {IFullPost} from "../../../types/IFullPost";

interface PostSmallExampleProps{
    post: IPost|IFullPost;
    navigator: any;
    isFull:boolean
}


const PostSmallExample:FC<PostSmallExampleProps> = ({post, navigator,isFull}) => {



    const tagRedirect = (tag:string) => {
        const url = `/ticker/${tag.slice(1).toLowerCase()}`
        navigator(url)
    }

    const commentRedirect = (e) => {

        navigator(`/post/${post.post_link}`)
    }

    let id:number = 0


    return (

        <div className={classes.post_container}>
            <div className={classes.post_text}>
                {ReactHtmlParser(post.content, {

                    transform: (node) => {




                        if (node.name === "div") {
                            id++
                            return (
                                <div
                                    key={`${id}-${post.id}`}
                                    className={classes.tags_in_text}
                                    onClick={()=>navigator(`/ticker/${node.children[0].data.slice(1)}`)}
                                >
                                    {node.children[0].data}
                                </div>
                            );
                        }
                    }
                })}
                {/*{isReadMore?post.content.slice(0, 800):post.content}*/}
                {/*{isReadMore?<div className={classes.read_more} onClick={()=>setIsReadMore(false)}>read more</div>:null}*/}
            </div>
            <PostsTags tags={post.tags} tagRedirect={tagRedirect}/>
            <div className={`no_select ${classes.author}`}>
                <div className={classes.by}>
                    by
                </div>
                {post.author_nickname}
            </div>
            <div className={classes.buttons_bottom_container}>
                <div className={classes.buttons_bottom_right_container}>
                    <CommentsCounter CommentCount={post.comments} commentRedirect={commentRedirect}/>
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