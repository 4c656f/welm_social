import React, {FC, useState} from 'react';
import {useNavigate} from "react-router-dom";
import ValidationServices from "../../services/userServices/ValidationService";
import LoginInput from "../ui/LoginInput/LoginInput";
import Button from "../ui/Button/Button";
import {observer} from "mobx-react-lite";
import "../../utils/styles/pages/LoginForm.css"
import {useStores} from "../../store";

const Registrationform:FC = () => {

    const [email, setEmail] = useState("")
    const [validateEmail, setValidateEmail] = useState("")
    const [validateEmailFetching, setValidateEmailFetching] = useState(false)

    const [nickname, setNickname] = useState("")
    const [validateNickname, setValidateNickname] = useState("")
    const [validateNicknameFetching, setValidateNicknameFetching] = useState(false)

    const [password, setPassword] = useState("")
    const [validatePassword, setValidatePassword] = useState(true)

    const [isRegistrationFetching, setIsRegistrationFetching] = useState(false)

    const [timer, setTimer] = useState(null)

    const {UserStore} = useStores();
    const navigator = useNavigate()



    const  inputEmail = async e => {
        setEmail(e.target.value)

        clearTimeout(timer)

        const newTimer = setTimeout(async () => {
            setValidateEmailFetching(true)
            const resp = await ValidationServices.validate(e.target.value, "")

            if(resp.data){
                setValidateEmail("email taken")
            }else{
                setValidateEmail("")
            }
            setValidateEmailFetching(false)
        }, 500)

        setTimer(newTimer)
    }

    const inputNickname = async (e) => {
        setNickname(e.target.value)

        clearTimeout(timer)

        const newTimer = setTimeout(async () => {
            setValidateNicknameFetching(true)
            const resp = await ValidationServices.validate("", e.target.value)

            if(resp.data){
                setValidateNickname("nickname taken")
            }else{
                setValidateNickname("")
            }
            setValidateNicknameFetching(false)
        }, 500)

        setTimer(newTimer)
    }
    const inputPassword = e => {
        setPassword(e.target.value)
        clearTimeout(timer)

        const newTimer = setTimeout(() => {


            if(e.target.value.length<6){
                setValidatePassword(false)
                return
            }
            setValidatePassword(true)
        }, 500)

        setTimer(newTimer)
    }

    const registration = async () => {
        if (validateNickname && validateEmail){
            if(password.length > 5 && nickname && email){
                try{
                    setIsRegistrationFetching(true)
                    const res = await UserStore.registration(email, nickname, password);
                    setIsRegistrationFetching(false)
                    if(res.data === true){
                        console.log("registration")
                        navigator("/sign-in")
                        return
                    }


                }
                catch (e) {
                    console.log(e)
                }
            }

        }else{

        }
    }



    return (
        <div className={"form_container"}>
            <LoginInput value={email} onChangeFc={inputEmail} placeholder={"email"} message={validateEmail} isFetching={validateEmailFetching}/>
            <LoginInput value={nickname} onChangeFc={inputNickname} placeholder={"nickname"} message={validateNickname} isFetching={validateNicknameFetching}/>
            <LoginInput value={password} onChangeFc={inputPassword} placeholder={"password"} type={"password"} message={!validatePassword?"password to week":null}/>
            <Button onClick={registration} content={"register"} isFetching={isRegistrationFetching} width={"100%"}/>
        </div>
    );
};

export default observer(Registrationform);