import React, {FC, useContext, useState} from 'react';
import { ReactComponent as SaveIcon } from "../../../utils/svg/bookmark.svg";
import PostsServices from "../../../services/postsServices/PostsService";
import classes from "./SavePostButton.module.css";
import {useStores} from "../../../store";
interface SavePostButtonProps{
    postId: number;
    isSaved:number;
}

const SavePostButton:FC<SavePostButtonProps> = ({postId, isSaved}) => {

    const [isSavedState, setIsSavedState]= useState(isSaved>0)

    const {UserStore, StockStore} = useStores();


    const save = async () => {
        if(!UserStore.isAuth) {
            console.log("не авторизован")
            return
        }
        const resp = await PostsServices.SavePost(UserStore.user, postId)
        if(resp.data === true){
            setIsSavedState((prev)=>{return!prev})
        }
    }


    return (
        <div onClick={()=>UserStore.privateModalWrapper(save)} className={`${classes.save_icon} ${isSavedState?classes.active:""}`}>
            <SaveIcon/>
        </div>
    );
};

export default SavePostButton;