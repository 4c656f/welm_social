import React, {FC} from 'react';
import classes from "./CommentsCounter.module.css";
import { ReactComponent as CommentIcon } from "../../../utils/svg/message-circle-01.svg"



const CommentsCounter:FC<{CommentCount:number}> = ({CommentCount}) => {


    return (
        <div className={classes.comment_count_wrapper}>
            <div className={classes.comment_count_count}>
                {CommentCount}
            </div>
            <div className={classes.comment_count_icon}>
                <CommentIcon/>
            </div>


        </div>
    );
};

export default CommentsCounter;