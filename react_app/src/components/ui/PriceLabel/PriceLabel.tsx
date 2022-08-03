import React, {FC, memo, useEffect, useState} from 'react';
import classes from "./PriceLabel.module.css";
import {IDayPrice} from "../../../types/IDayPrice";

interface PriceLabelProps{
    price:IDayPrice[string]|IDayPrice;
    isPercent:boolean;
    setIsPercent:any;
    isLoading:boolean;
}


const PriceLabel:FC<PriceLabelProps> = ({price, isPercent, setIsPercent, isLoading}) => {





    const [lightClass, setLightClass] = useState(0)
    const [isPositive, setIsPositive] = useState("")







    useEffect(()=>{
        if(isLoading)return
        if(price["close"]>price["open"]){
            setIsPositive("+")
            setLightClass(1)
        }else if(price["close"]<price["open"]){
            setIsPositive("")
            setLightClass(-1)
        }
        setTimeout(() => {
            setLightClass(0)
        }, 500)


    },[price])







    return (
        <>
        {isLoading?
                null
                :
                <div className={`${isLoading?"loader_bg":""} ${classes.price_wrapper} `}>
                    <div className={classes.current_price} >
                        {price["close"]}

                    </div>
                    <div className={`${classes.price_change}
                    ${lightClass>0?classes.light_positive:lightClass<0?classes.light_negative:""}
                    ${price["close"]>price["open"]?classes.price_change_positive:classes.price_change_negative}`}
                         onClick={()=> setIsPercent((prev)=>!prev)}

                    >{
                        isPercent?`${isPositive} ${(price["close"]/price["open"]*100-100).toFixed(2)}%`
                            :
                            `${isPositive} ${(price["close"]-price["open"]).toFixed(2)}$`
                    }</div>
                </div>
        }
        </>

    );
};

export default memo(PriceLabel);