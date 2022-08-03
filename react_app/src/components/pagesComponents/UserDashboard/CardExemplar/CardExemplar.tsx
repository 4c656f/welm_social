import React, {ChangeEvent, FC, ReactNode, KeyboardEvent, useState} from 'react';
import {Reorder, useDragControls} from "framer-motion"
import classes from "./CardExemplar.module.css"
import {IDashboardElem} from "../../../../types/IDashboardElem";

interface CardExemplarProps {

    ticker:string;
    setDashboardElems:any;
    dashboardElem:IDashboardElem;
    toggles: boolean;
    children: ReactNode;
    id:number;
    setStockAmountState;
}


const CardExemplar:FC<CardExemplarProps> = ({
                                                ticker,
                                                setDashboardElems,
                                                dashboardElem,
                                                toggles,
                                                id,
                                                children,
                                                setStockAmountState}) => {


    const [stockAmount, setStockAmount]= useState(dashboardElem["amount"])

    const remove_card = () => {
        setDashboardElems((prev)=> {
            return prev.filter((item, id_arr) => {
                return id !== id_arr
            })
        }
        )
        ;
    };


    const changeStockAmount = (e: ChangeEvent<HTMLInputElement>) => {

        setStockAmount((prev)=>{
            return e.target.validity.valid ? Number(e.target.value) : prev
        })

    }
    const enterPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter"){
            if(stockAmount < 1){
                remove_card()
                return
            }
            setDashboardElems((prev)=>{
                const wrap = prev
                wrap[id]["amount"] = stockAmount

                return wrap
            })
            setStockAmountState(prev=>!prev)
        }
    }


    const controls = useDragControls()


    return (
        <Reorder.Item  dragListener={false} dragControls={controls} value={dashboardElem} className={classes.card} as={"div"} key={"reorder" + ticker}>

            <div className={classes.property_wrapper}>
                <div className={classes.tick_exchange}>
                    <div className={classes.cards_text_tick}>{ticker}</div>
                </div>



            </div>
            <div>
                <input value={stockAmount} pattern="[0-9]*" onChange={changeStockAmount} onKeyDown={enterPress}/>
            </div>
            {children}

            <div className={toggles?classes.reorder_handle_active:classes.disabledEl} onPointerDown={(e) => controls.start(e)}>
                <div className={toggles?classes.reorder_handle_sm:classes.disabledEl}></div>
                <div className={toggles?classes.reorder_handle_sm:classes.disabledEl}></div>
                <div className={toggles?classes.reorder_handle_sm:classes.disabledEl}></div>
            </div>

            <div className={toggles?classes.delete_card_active:classes.disabledEl} onClick={remove_card}>
                <div className={toggles?classes.inside_delete_card:classes.disabledEl}>

                </div>
            </div>




        </Reorder.Item>
    );
};

export default CardExemplar;