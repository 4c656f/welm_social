import React, {FC, memo, useEffect, useState} from 'react';
import classes from "./PriceLabel.module.css";
import {IDayPrice} from "../../../types/IDayPrice";

interface PriceLabelProps{
    price:IDayPrice[string];
    isPercent:boolean;
    setIsPercent:any;
    isLoading:boolean;
    isTooltip?:boolean;
    tooltipOpen?:number;
}


const PriceLabel:FC<PriceLabelProps> = ({price, isPercent, setIsPercent, isLoading,isTooltip,tooltipOpen}) => {





    const [lightClass, setLightClass] = useState(0)
    const [isPositive, setIsPositive] = useState("")
    const [priceChange, setPriceChange] = useState<any>()






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

    useEffect(()=>{
        if(isLoading)return
        console.log(isTooltip, tooltipOpen)
        if(isTooltip){
            if(price["close"]>tooltipOpen){
                setIsPositive("+")

            }
            if(price["close"]<tooltipOpen){
                setIsPositive("")

            }
            if(isPercent){
                setPriceChange((price["close"]/tooltipOpen*100-100).toFixed(2))
                return;
            }
            setPriceChange((price["close"]-tooltipOpen).toFixed(2))
            return;
        }

        if(isPercent){

            setPriceChange((price["close"]/price["open"]*100-100).toFixed(2))
            return;
        }
        setPriceChange((price["close"]-price["open"]).toFixed(2))
        return;

    },[price,isPercent, tooltipOpen, isTooltip])





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
                    ${isPositive==="+"?classes.price_change_positive:classes.price_change_negative}`}
                         onClick={()=> setIsPercent((prev)=>!prev)}

                    >{
                        isPercent?`${isPositive} ${priceChange}%`
                            :
                            `${isPositive} ${priceChange}$`
                    }</div>
                </div>
        }
        </>

    );
};

export default memo(PriceLabel);