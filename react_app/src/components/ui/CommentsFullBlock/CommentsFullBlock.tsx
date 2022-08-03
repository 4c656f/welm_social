import React, {FC, useContext, useEffect, useState} from 'react';
import classes from './CommentsFullBlock.module.css'
import {IComment} from "../../../types/IFullPost";
import CommentExemplar from "./CommentExemplar/CommentExemplar";
import Button from "../Button/Button";
import PostsService from "../../../services/postsServices/PostsService";
import {useStores} from "../../../store";


interface CommentsFullBlockProps {
    comments:IComment[];
    postId:number
}


const CommentsFullBlock:FC<CommentsFullBlockProps> = ({comments, postId}) => {

    const [commentsState, setCommentsState] = useState<IComment[]>(comments)
    const [inputComment, setInputComment] = useState("")

    const {UserStore, StockStore} = useStores();

    const addComment = async () => {
        if(inputComment.length<1)return
        const resp = await PostsService.AddComment(UserStore.user, inputComment, postId)
        if(resp.data !== true){return}
        setCommentsState((prev)=>{


            if(prev.length<1){
                return [{
                    "author_nickname": UserStore.user.user_nickname,
                    "author_id": UserStore.user.user_id,
                    "content": inputComment,
                    "post_id": postId,
                    "creation_date":  Date.now(),
                    "id": 0

                }]
            }
            let prevId = prev[0]["id"]
            return [{
                "author_nickname": UserStore.user.user_nickname,
                "author_id": UserStore.user.user_id,
                "content": inputComment,
                "post_id": postId,
                "creation_date":  Date.now(),
                "id": prevId + 1

            }, ...prev]

        })
    }
    useEffect(()=>{
        console.log(commentsState)
    },[commentsState])

    return (
        <div>
            <input value={inputComment} onChange={(e)=>{setInputComment(e.target.value)}}/>
            <Button content={"send"} onClick={()=>UserStore.privateModalWrapper(addComment)}/>
            {commentsState.map((val)=>{
                return(<CommentExemplar key={val.id} comment={val}/>)
            })}
        </div>
    );
};

export default CommentsFullBlock;