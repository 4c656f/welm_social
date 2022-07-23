import React, {FC} from 'react';
import SmallSpinnerLoader from "../SmallSpinnerLoader/SmallSpinnerLoader";
import classes from "./LoginInput.module.css"

interface LoginInputProps{
    value:string;
    onChangeFc: (params:any)=>any;
    placeholder: string;
    type?:string;
    message?:string;
    isFetching?:boolean;
}

const LoginInput:FC<LoginInputProps> = ({value, onChangeFc, placeholder, type, message, isFetching}) => {
    return (
        <div className={classes.input_container}>
            {
                message?
                    <div className={classes.message}>{message}</div>
                    :null
            }
            {
                isFetching?
                    <div className={classes.loader}>
                        <SmallSpinnerLoader/>
                    </div>
                    :null
            }
            <input className={classes.input} placeholder={placeholder} value={value} onChange={onChangeFc} type={type} >

            </input>
        </div>
    );
};

export default LoginInput;