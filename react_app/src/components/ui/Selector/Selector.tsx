import React, {FC, memo, useEffect, useState} from 'react';
import classes from "./Selector.module.css";
import {ReactComponent as LikeSvg} from "../../../utils/svg/like.svg"

interface options{
    optionText:string;
    value: string|number;
}


interface SelectorProps{
    initState: string;
    options: options[];
    setFc: any;
}


const Selector:FC<SelectorProps> = ({initState, options, setFc}) => {

    const [isOptions, setIsOptions] = useState(false)
    const [selectorText, setSelectorText] = useState(initState)

    useEffect(()=>{
        options.map((val)=>{
            if(val.optionText === initState){
                setFc(val.value)
                return
            }
            return;
        })
    },[])

    const optionClick = (e, text) => {
        setIsOptions(false)
        setSelectorText(text)
        setFc(e.target.dataset.value)
    }


    return (
        <div>
            <div className={`no_select ${classes.selector} ${isOptions?classes.active_icon:""}`} onClick={()=>setIsOptions((prev)=>!prev)}>
                {selectorText}
                <LikeSvg/>
            </div>
            <div className={`no_select ${classes.option_wrapper}`}>
            {isOptions?options.map((val)=>{

                return(
                    <div onClick={(e)=>optionClick(e, val.optionText)} data-value={val.value} key={val.value} className={classes.option}>{val.optionText}</div>
                )

            }):null

            }
            </div>
        </div>
    );
};

export default memo(Selector);