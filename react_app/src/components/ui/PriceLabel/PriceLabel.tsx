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
    type?:string
}


const PriceLabel:FC<PriceLabelProps> = ({
                                            price,
                                            isPercent,
                                            setIsPercent,
                                            isLoading,
                                            isTooltip,
                                            tooltipOpen,
                                            type
                                        }) => {





    const [lightClass, setLightClass] = useState(0)
    const [isPositive, setIsPositive] = useState("")
    const [priceChange, setPriceChange] = useState<any>()






    useEffect(()=>{
        if(isLoading)return
        if(!price || !price["close"] || !price["open"]){
            return;
        }
        setTimeout(() => {
            setLightClass(0)
        }, 500)
        if(price["close"]>price["open"]){
            setLightClass(1)
            return;
        }
        setLightClass(-1)


    },[price])

    useEffect(()=>{
        if(isLoading){
            setPriceChange(0)
            return;
        }
        if(!price || !price["close"] || !price["open"]){
            setPriceChange(0)
            return;
        }


        if(isTooltip){
            if(!tooltipOpen)return;
            if(price["close"]>tooltipOpen){
                setIsPositive("+")

            }else{
                setIsPositive("")

            }
            if(isPercent){
                // @ts-ignore
                setPriceChange((price["close"]/tooltipOpen*100-100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}))
                return;
            }
            // @ts-ignore
            setPriceChange((price["close"]-tooltipOpen).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}))
            return;
        }
        if(price["close"]>price["open"]){
            setIsPositive("+")

        }else{
            setIsPositive("")

        }

        if(isPercent){
            // @ts-ignore
            setPriceChange((price["close"]/price["open"]*100-100).toLocaleString('en-US',{minimumFractionDigits:2, maximumFractionDigits:2}))
            return
        }
        // @ts-ignore
        setPriceChange((price["close"]-price["open"]).toLocaleString('en-US',{minimumFractionDigits:2, maximumFractionDigits:2}))
        return;

    },[price, isPercent, tooltipOpen, isTooltip])





    return (
        <>
        {isLoading?
                <div className={`loader_bg ${classes.price_wrapper} `}>
                    <div className={classes.current_price} >
                        {`${0} $`}

                    </div>
                    <div className={`${classes.price_change} ${classes.neutral}`}
                    >0 $</div>
                </div>
                :
                <div className={classes.price_wrapper}>
                    <div className={`no_select ${classes.current_price}`} >

                        {`${!price?0:!price["close"]?0:price["close"].toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})} $`}

                    </div>
                    <div className={`no_select ${classes.price_change}
                    ${lightClass>0?classes.light_positive:lightClass<0?classes.light_negative:""}
                    ${isPositive==="+"?classes.price_change_positive:classes.price_change_negative}`}
                         onClick={()=> setIsPercent((prev)=>!prev)}

                    >{
                        isPercent?`${isPositive} ${priceChange} %`
                            :
                            `${isPositive} ${priceChange} $`
                    }</div>
                </div>
        }
        </>

    );
};

export default memo(PriceLabel);