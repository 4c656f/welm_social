import React, {FC,memo} from 'react';
import SmallSpinnerLoader from "../SmallSpinnerLoader/SmallSpinnerLoader";
import classes from "./Button.module.css"
import {IButtonProps} from "../../../types/IButtonProps";





const Button:FC<IButtonProps> = ({content, onClick, width, isFetching, isDisabled, isActive}) => {



    return (

        <div className={`${classes.button} ${isDisabled?classes.disabled:""} ${isActive?classes.active:""}`} style={{width: width}} onClick={onClick}>
            {
                isFetching?
                    <div className={classes.loader_wrapper}>
                        <SmallSpinnerLoader/>
                    </div>
                    :null
            }
            {content}
        </div>
    );
};

export default memo(Button);