import React, {FC} from 'react';
import {ITickerDescription} from "../../../types/ITickerDescription";
import classes from "./SearchTickerItem.module.css";
import {useNavigate} from "react-router-dom";


interface SearchTickerItemProps extends  ITickerDescription{
    onClick:any
}


const SearchTickerItem:FC<SearchTickerItemProps> = ({ticker, id, exchange, company_name, onClick}) => {





    return (
        <div className={classes.search_card} onClick={()=>onClick(ticker)}>
            <div className={classes.left_container}>
                <div className={`${classes.se} ${classes.search_tick}`} >{ticker}</div>
            </div>
            <div className={classes.right_container}>
                <div className={`${classes.search_text} ${classes.search_exchange}`} >{exchange}</div>
                <div className={`${classes.search_text} ${classes.search_name}`} >{company_name}</div>
            </div>
        </div>
    );
};

export default SearchTickerItem;