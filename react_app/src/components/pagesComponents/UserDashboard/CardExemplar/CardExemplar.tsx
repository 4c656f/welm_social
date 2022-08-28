import React, {ChangeEvent, FocusEvent, FC, KeyboardEvent, memo, ReactNode, useRef, useState, useEffect} from 'react';
import {Reorder, useDragControls} from "framer-motion"
import classes from "./CardExemplar.module.css"
import {IDashboardElem} from "../../../../types/IDashboardElem";
import {useStores} from "../../../../store";
import Button from "../../../ui/Button/Button";
import {ReactComponent as TrashSvg} from "../../../../utils/svg/trash.svg"

interface CardExemplarProps {

    ticker:string;
    dashboardElem:IDashboardElem;
    toggles: boolean;
    children: ReactNode;
    id:number;
    setStockAmountState;
    navigator:any;
}


const CardExemplar:FC<CardExemplarProps> = ({
                                                ticker,
                                                dashboardElem,
                                                toggles,
                                                id,
                                                children,
                                                setStockAmountState,
                                                navigator
                                            }) => {


    const [stockAmount, setStockAmount]= useState(dashboardElem["amount"])
    const {StockStore}= useStores()

    const [width, setWidth] = useState(20)

    const remove_card = () => {
        StockStore.deleteFromDashboard(id)
    };




    useEffect(()=>{

        setWidth(stockAmount.toString().length*9 + 17)
    }, [stockAmount])

    const changeStockAmount = (e: ChangeEvent<HTMLInputElement>) => {

        const num = Number(e.target.value.replace(/\s/g, ""))
        if(isNaN(num))return

        setStockAmount(num)




    }

    const enterPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter"){
            e.preventDefault()
            if(stockAmount < 1){
                remove_card()
                return
            }
            StockStore.changeAmount(id, stockAmount)
            setStockAmountState(prev=>!prev)
        }
    }

    const onClickIncriminate = () =>{

        setStockAmount((prev) => {
            return prev + 1
        })

        StockStore.changeAmount(id, stockAmount + 1)
        setStockAmountState(prev=>!prev)
    }

    const onClickDecriminate = () =>{
        if(stockAmount < 2){
            remove_card()
            return
        }
        setStockAmount((prev) => {
            return prev - 1
        })
        StockStore.changeAmount(id, stockAmount - 1)
        setStockAmountState(prev=>!prev)

    }

    const onBlur = (e:FocusEvent<HTMLInputElement>)=>{
        e.preventDefault()
        if(stockAmount < 1){
            remove_card()
            return
        }
        StockStore.changeAmount(id, stockAmount)
        setStockAmountState(prev=>!prev)
    }

    const controls = useDragControls()


    return (
        <Reorder.Item  dragListener={false} dragControls={controls} value={dashboardElem} className={classes.card} as={"div"} key={"reorder" + ticker}>

            <div className={classes.property_wrapper}>
                <div className={classes.tick_exchange}>
                    <div className={`${classes.cards_text_tick} no_select`} onClick={()=>{navigator(`/ticker/${ticker}`)}}>{ticker}</div>
                </div>

            </div>



            <div className={classes.change_block}>


                <div className={classes.change_container}>
                    <Button onClick={onClickIncriminate} content={"+"}/>

                    <input
                        className={`default_input ${classes.amount_input}`}
                        style={{width: `${width}px`}}
                        value={stockAmount.toLocaleString('ru-RU',{maximumFractionDigits:0})}
                        pattern="[0-9]*" onChange={changeStockAmount}
                        onKeyDown={enterPress}
                        onBlur={onBlur}
                    />

                    <Button onClick={onClickDecriminate} content={stockAmount<2?"":"-"} >
                        <div className={classes.trash_container}>
                            {stockAmount < 2 ? <TrashSvg/> : null}
                        </div>
                    </Button>
                </div>

                {children}

            </div>
            {toggles?
                <>
                    <div className={toggles?classes.reorder_handle_active:classes.disabledEl} onPointerDown={(e) => controls.start(e)}>
                        <div className={toggles?classes.reorder_handle_sm:classes.disabledEl}></div>
                        <div className={toggles?classes.reorder_handle_sm:classes.disabledEl}></div>
                        <div className={toggles?classes.reorder_handle_sm:classes.disabledEl}></div>
                    </div>

                    <div className={toggles?classes.delete_card_active:classes.disabledEl} onClick={remove_card}>
                        <div className={toggles?classes.inside_delete_card:classes.disabledEl}>

                        </div>
                    </div>
                </>
                :null
            }





        </Reorder.Item>
    );
};

export default memo(CardExemplar);