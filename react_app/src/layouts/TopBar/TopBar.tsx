import React, {memo, useState} from 'react';
import classes from "./TopBar.module.css";
import Button from "../../components/ui/Button/Button";
import {useNavigate} from "react-router-dom";
import TopBarSearch from "../../components/ui/TopBarSearch/TopBarSearch";
import {observer} from "mobx-react-lite";
import {useStores} from "../../store";
import {ReactComponent as LikeSvg} from "../../utils/svg/like.svg"

const TopBar = () => {

    const [isToggleActive, setIsToggleActive] = useState(false)
    const {UserStore} = useStores();

    const navigator = useNavigate()



    return (
        <div className={classes.bar_wrapper}>
            <TopBarSearch/>
            {UserStore.isAuth?
                <div className={`no_select ${classes.nickname} ${isToggleActive?classes.active:""}`} onClick={()=>setIsToggleActive((prev)=>!prev)}>

                    {UserStore.user.user_nickname}
                    <LikeSvg/>
                    {isToggleActive
                        ?
                        <div className={classes.nickname_bt_wrap}>
                            <Button onClick={()=>{UserStore.logout()}} content={"log out"}/>
                        </div>
                        :null}

                </div>

                :
                <div className={classes.button_wrapper}>
                    <Button onClick={()=>{navigator("/sign-in")}} content={"sign in"}/>
                    <Button onClick={()=>{navigator("/sign-up")}} content={"sign up"}/>
                </div>
            }
        </div>
    );
};

export default memo(observer(TopBar));