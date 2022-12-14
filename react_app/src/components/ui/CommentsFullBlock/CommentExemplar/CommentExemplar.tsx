import React, {FC, memo} from 'react';
import classes from "./CommentExemplar.module.css"
import {IComment} from "../../../../types/IFullPost";


interface CommentExemplarProps {
    comment:IComment
}


const CommentExemplar:FC<CommentExemplarProps> = ({comment}) => {
    return (
        <div className={classes.container}>
            <div className={`no_select ${classes.author}`}>

                {comment.author_nickname}
            </div>

            <div className={classes.content}>{comment.content}</div>
        </div>
    );
};

export default memo(CommentExemplar);