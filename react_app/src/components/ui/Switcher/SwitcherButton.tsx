import React, {FC} from 'react';
import classes from "./SwitcherButton.module.css";
import {IButtonProps} from "../../../types/IButtonProps";


const SwitcherButton:FC<IButtonProps> = ({content, onClick, width, isFetching, isDisabled, isActive}) => {
    return (

        <div className={`${classes.button} ${isDisabled?classes.disabled:""} ${isActive?classes.active:""}`} style={{width: width}} onClick={()=>onClick(content)}>

            {content}
        </div>
    );
};

export default SwitcherButton;