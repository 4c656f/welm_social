import React, {FC, useEffect} from 'react';
import {format} from 'date-fns';
import {ITickerCharData} from "../../../types/ITickerChar";


interface payload{
    payload:ITickerCharData
}


interface CustomTooltipProps{
    active?:boolean;
    payload?:payload[];
    label?:string
}


const CustomTooltip:FC<CustomTooltipProps> = ({active, payload, label}) => {

    if(active){


        const date = () =>{
            try {


                return format(new Date(label), "dd,MMM, yyyy")

            }
            catch (e){
                console.log(e)
            }


        }





        return (
            <div className={"custom_tooltip"}>
                <div className={"tooltip_date"}>{date()}</div>
                <div className={"tooltip_price"}>{`${payload[0]["payload"]["price"]} $`}</div>
            </div>

        )

    }
    else {
        return null
    }
};

export default CustomTooltip;