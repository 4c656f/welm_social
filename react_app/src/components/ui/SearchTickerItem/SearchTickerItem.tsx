import React, {FC} from 'react';
import {ITickerDescription} from "../../../types/ITickerDescription";
import classes from "./SearchTickerItem.module.css";


interface SearchTickerItemProps extends  ITickerDescription{
    onClick:any;
    selection:number;
    index:number
}


const SearchTickerItem:FC<SearchTickerItemProps> = ({ticker, id, exchange, company_name, onClick, selection, index}) => {





    return (
        <div className={`${selection===index?classes.active:""} ${classes.search_card}`} onClick={()=>onClick(ticker)}>
            <div className={classes.left_container}>
                <div className={`no_select ${classes.se} ${classes.search_tick}`} >{ticker}</div>
            </div>
            <div className={classes.right_container}>
                <div className={`no_select ${classes.search_text} ${classes.search_exchange}`} >{exchange}</div>
                <div className={`no_select ${classes.search_text} ${classes.search_name}`} >{company_name}</div>
            </div>
        </div>
    );
};

export default SearchTickerItem;