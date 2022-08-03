import React, {FC, useCallback, useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import LoginInput from "../ui/LoginInput/LoginInput";
import Button from "../ui/Button/Button";
import {observer} from "mobx-react-lite";
import "../../utils/styles/pages/LoginForm.css"
import {useStores} from "../../store";



const Loginform:FC = () => {

    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")

    const [password, setPassword] = useState("")
    const [passwordError, setPasswordError] = useState("")


    const [isLoginFetching, setIsLoginFetching] = useState(false)


    const {UserStore, StockStore} = useStores();

    const navigator = useNavigate()


    const inputEmail = useCallback ((e) => {
        setEmail(e.target.value)
    },[])

    const inputPassword = useCallback ((e) => {
        setPassword(e.target.value)
    },[])


    const Login = async () => {
        try {
            setIsLoginFetching(true)
            const res = await UserStore.login(email, password);
            setIsLoginFetching(false)

            if (res[0]) {

                return navigator("/")
            }
            if (res[1] === "user not found") {
                setEmailError("invalid email")
                return
            }
            if (res[1] === "invalid password") {
                setPasswordError("invalid password")
                return
            }


        } catch (e) {
            console.log(e)
        }
    }


    return (
        <div className={"form_container"}>
            <LoginInput value={email} onChangeFc={inputEmail} placeholder={"email"} message={emailError} />
            <LoginInput value={password} onChangeFc={inputPassword} placeholder={"password"} type={"password"} message={passwordError}/>
            <Button onClick={Login} content={"login"} isFetching={isLoginFetching} width={"100%"}/>
        </div>
    );
};

export default observer(Loginform);