import React, {FC, memo, useEffect, useState} from 'react';
import StocksServices from "../../../../services/stocksServices/StocksServices";
import {ITickerDescription} from "../../../../types/ITickerDescription";
import classes from "./Suggestions.module.css"



interface SuggestionsProps {
    top:number;
    left:number;
    text:string
    selection: number|boolean;
    searchResults: ITickerDescription[]
    setSearchResults:any;
}


const Suggestions:FC<SuggestionsProps> = ({top,left, text, selection,searchResults, setSearchResults}) => {






    useEffect(()=>{
        const searchCallback = async () => {
            const resp = await StocksServices.GetTickerSearch(text)
            setSearchResults(resp.data)
        }
        searchCallback()
    }, [text])

    if(text.length<1)return null
    if(searchResults.length<1)return null

    return (
        <div className={classes.main_container}
            style={{top: top + 20, left: left}}
        >
            {
                searchResults.map((val, index)=>{
                    return(
                        <div key={val.ticker} className={`${classes.suggestion_text} ${index===selection?classes.active:""}`}>
                            {val.ticker}
                        </div>
                    )
                })
            }
        </div>
    );
};

export default memo(Suggestions);