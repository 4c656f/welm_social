import React from 'react';
import {ReactComponent as SuccessIconSvg} from "../../../utils/svg/check-circle.svg"
import classes from "./SuccesIcon.module.css"

const SuccessIcon = () => {
    return (
        <div className={classes.main}>
            <SuccessIconSvg/>
        </div>
    );
};

export default SuccessIcon;