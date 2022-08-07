import React, {FC, memo, useEffect, useState} from 'react';
import SmallSpinnerLoader from "../SmallSpinnerLoader/SmallSpinnerLoader";
import classes from "./Button.module.css"
import {IButtonProps} from "../../../types/IButtonProps";
import SuccessIcon from "../SuccessIcon/SuccessIcon";


const Button:FC<IButtonProps> = ({
                                     content,
                                     onClick,
                                     width,
                                     isFetching,
                                     isDisabled,
                                     isActive,
                                     isSuccess,
                                    children}) => {





    return (

        <div className={`${classes.button} ${isDisabled?classes.disabled:""} ${isActive?classes.active:""}`} style={{width: width}} onClick={onClick}>
            {children?
                children
                :
                null

            }
            {
                isFetching?
                    <div className={classes.loader_wrapper}>
                        <SmallSpinnerLoader/>
                    </div>
                    :null
            }
            {
                isSuccess?
                    <div className={classes.loader_wrapper}>
                        <SuccessIcon/>
                    </div>
                    :null
            }
            {content}
        </div>
    );
};

export default memo(Button);