import React from 'react';
import classes from "./LoginModal.module.css"
import Button from "../../components/ui/Button/Button";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {useStores} from "../../store";
import {ReactComponent as CloseSvg} from "../../utils/svg/x-close.svg";

const LoginModal = () => {

    const navigator = useNavigate()
    const {UserStore} = useStores();



    const modalRedirect = (to:string) => {
        UserStore.isModal = false
        navigator(to)
    }


    return (
        <div className={classes.main_container}>
            <div className={classes.form_container}>

                <div className={classes.close_bt} onClick={()=>UserStore.isModal=false}><CloseSvg/></div>
                <div className={classes.sign_in}>Sign up</div>
                <Button onClick={()=>modalRedirect("sign-in")} content={"sign in"}/>
                <div className={classes.sign_in}>Sign in</div>
                <Button onClick={()=>modalRedirect("sign-up")} content={"sign up"}/>
            </div>
            <div className={classes.background} onClick={()=>UserStore.isModal=false}>

            </div>
        </div>
    );
};

export default observer(LoginModal);