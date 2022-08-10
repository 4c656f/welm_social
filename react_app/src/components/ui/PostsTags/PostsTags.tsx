import React, {FC, memo} from 'react';
import classes from "./PostsTags.module.css";
import {ITag} from "../../../types/IPost";

interface PostsTagsProps{
    tags: ITag[];
    tagRedirect:any;
}

const PostsTags:FC<PostsTagsProps> = ({tags,tagRedirect}) => {
    return (
        <>
        {tags.length>0?
                <div className={classes.tags_wrapper}>
                {tags.map((val)=>{
                    return(
                        <div onClick={()=>tagRedirect(val.ticker_tag)} key={val.id} className={`no_select ${classes.tag}`}>
                            {val.ticker_tag}
                        </div>
                    )
                })}
            </div>:null}
        </>

    );
};

export default memo(PostsTags);