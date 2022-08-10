import React, {FC, useEffect, useRef, useState} from 'react';
import {IComment} from "../../../types/IFullPost";
import CommentExemplar from "./CommentExemplar/CommentExemplar";
import Button from "../Button/Button";
import PostsService from "../../../services/postsServices/PostsService";
import {useStores} from "../../../store";
import classes from "./CommentsFullBlock.module.css"
import autosize from 'autosize';

interface CommentsFullBlockProps {
    comments:IComment[];
    postId:number
}


const CommentsFullBlock:FC<CommentsFullBlockProps> = ({comments, postId}) => {

    const [commentsState, setCommentsState] = useState<IComment[]>(comments)
    const [inputComment, setInputComment] = useState("")

    const [isFetching, setIsFetching] = useState(false)
    const [isSuc, setIsSuc] = useState(false)

    const {UserStore} = useStores();


    const inputRef = useRef()

    const addComment = async () => {
        if (inputComment.length < 1) return
        setIsFetching(true)
        const resp = await PostsService.AddComment(UserStore.user, inputComment, postId)
        setIsFetching(false)

        if (resp.data !== true) {
            return
        }
        setIsSuc(true)
        setTimeout(()=>setIsSuc(false), 1000)
        setInputComment("")
        setCommentsState((prev) => {


            if (prev.length < 1) {
                return [{
                    "author_nickname": UserStore.user.user_nickname,
                    "author_id": UserStore.user.user_id,
                    "content": inputComment,
                    "post_id": postId,
                    "creation_date": Date.now(),
                    "id": 0

                }]
            }
            let prevId = prev[0]["id"]
            return [{
                "author_nickname": UserStore.user.user_nickname,
                "author_id": UserStore.user.user_id,
                "content": inputComment,
                "post_id": postId,
                "creation_date": Date.now(),
                "id": prevId + 1

            }, ...prev]

        })
    }

    useEffect(()=>{
        autosize(inputRef.current)
    },[inputComment])


    return (
        <div className={classes.main_container}>

            <div className={classes.input_container}>
                <textarea
                    ref={inputRef}
                    placeholder={"input comment"}
                    className={`default_input ${classes.text_area}`}

                    value={inputComment}
                    onChange={(e)=>{setInputComment(e.target.value)}}

                />
                {/*<input className={`default_input`} placeholder={"input comment"} value={inputComment} onChange={(e)=>{setInputComment(e.target.value)}}/>*/}
                <Button content={"send"} onClick={()=>UserStore.privateModalWrapper(addComment)} isFetching={isFetching} isSuccess={isSuc}/>
            </div>

            <div className={classes.comments_container}>
                {commentsState.map((val)=>{
                    return(<CommentExemplar key={val.id} comment={val}/>)
                })}
            </div>
        </div>
    );
};

export default CommentsFullBlock;