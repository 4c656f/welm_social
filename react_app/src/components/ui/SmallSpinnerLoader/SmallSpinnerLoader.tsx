import React from 'react';
import {ReactComponent as LoaderSvg} from "../../../utils/svg/spinnerloader.svg"
import classes from "./Small.SpinnerLoader.module.css"

const SmallSpinnerLoader = () => {
    return (
        <div className={classes.loader}>
            <LoaderSvg/>
        </div>
    );
};

export default SmallSpinnerLoader;