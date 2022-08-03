import React from 'react';
import {useParams} from "react-router-dom";
import FullPostComponent from "../components/pagesComponents/FullPostComponent/FullPostComponent";


const FullPost = () => {

    const {postLink} = useParams<string>()

    return (
        <div>
            <FullPostComponent postLink={postLink}/>
        </div>
    );
};

export default FullPost;