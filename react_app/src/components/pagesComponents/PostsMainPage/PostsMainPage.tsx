import React from 'react';
import PostsFeed from "../../ui/PostsFeed/PostsFeed";

const PostsMainPage = () => {
    return (
        <div className={"scroll_container"}>
            <PostsFeed ticker={false}/>
        </div>
    );
};

export default PostsMainPage;