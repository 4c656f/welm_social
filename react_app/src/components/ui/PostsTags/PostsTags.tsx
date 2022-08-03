import React, {FC, memo} from 'react';
import classes from "./PostsTags.module.css";
import {ITag} from "../../../types/IPost";

interface PostsTagsProps{
    tags: ITag[];
    tagRedirect:any;
}

const PostsTags:FC<PostsTagsProps> = ({tags,tagRedirect}) => {
    return (
        <div className={classes.tags_wrapper}>
            {tags.map((val)=>{
                return(
                    <div onClick={()=>tagRedirect(val.ticker_tag)} key={val.id} className={classes.tag}>
                        {val.ticker_tag}
                    </div>
                )
            })}
        </div>
    );
};

export default memo(PostsTags);