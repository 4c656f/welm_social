import React, {FC, useContext, useState} from 'react';
import { ReactComponent as SaveIcon } from "../../../utils/svg/bookmark.svg";
import {Context} from "../../../index";
import PostsServices from "../../../services/postsServices/PostsService";
import classes from "./SavePostButton.module.css";
interface SavePostButtonProps{
    postId: number;
    isSaved:number;
}

const SavePostButton:FC<SavePostButtonProps> = ({postId, isSaved}) => {

    const [isSavedState, setIsSavedState]= useState(isSaved>0)

    const {store} = useContext(Context)


    const save = async () => {
        if(!store.isAuth) {
            console.log("не авторизован")
            return
        }
        const resp = await PostsServices.SavePost(store.user, postId)
        if(resp.data === true){
            setIsSavedState((prev)=>{return!prev})
        }
    }


    return (
        <div onClick={save} className={`${classes.save_icon} ${isSavedState?classes.active:""}`}>
            <SaveIcon/>
        </div>
    );
};

export default SavePostButton;