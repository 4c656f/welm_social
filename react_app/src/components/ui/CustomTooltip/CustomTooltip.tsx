import React, {FC, memo, useEffect, useState} from 'react';
import {format} from 'date-fns';
import {ITickerCharData} from "../../../types/ITickerChar";
import classes from "./CustomTooltip.module.css"


interface payload{
    payload:ITickerCharData
}


interface CustomTooltipProps{
    active?:boolean;
    payload?:payload[];
    label?:string;
    setTooltipOpen:(value: number | ((prevVar: number) => number)) => number | any;
    setIsTooltip:(value: boolean | ((prevVar: boolean) => boolean)) => boolean | boolean;
}


const CustomTooltip:FC<CustomTooltipProps> = ({active, payload, label, setTooltipOpen, setIsTooltip}) => {

    const [timer, setTimer] = useState<any>()



    useEffect(()=>{
        if(!active) {

            setIsTooltip(false)
            return
        }
        if(!payload[0]) {
            setIsTooltip(false)
            return
        }
        setIsTooltip(true)
        setTooltipOpen(payload[0]["payload"]["price"])

    }, [payload])

    if(!active) {
        setIsTooltip(false)
        return null
    }



    const date = () =>{
        try {


            return format(new Date(label), "dd,MMM, yyyy")

        }
        catch (e){
            console.log(e)
        }


    }











    return (
        <div className={classes.main_container}>
            <div className={classes.text}>{date()}</div>
            <div className={classes.text}>{`${payload[0]["payload"]["price"]} $`}</div>
        </div>

    )



};

export default memo(CustomTooltip);