import React, {useState} from 'react';
import classes from "./TopBarSearch.module.css";
import StocksServices from "../../../services/stocksServices/StocksServices";
import {ITickerDescription} from "../../../types/ITickerDescription";
import SearchTickerItem from "../SearchTickerItem/SearchTickerItem";
import {useNavigate} from "react-router-dom";

const TopBarSearch = () => {

    const [searchText, setSearchText] = useState("")
    const [timer, setTimer] = useState(null)
    const [results, setResults] = useState([] as ITickerDescription[])
    const  inputSearch = (e) => {
        setSearchText(e.target.value)
        clearTimeout(timer)
        const newTimer = setTimeout(async () => {
            const resp = await StocksServices.GetTickerSearch(e.target.value)
            setResults(resp.data)
        }, 500)
        setTimer(newTimer)
    }

    const navigator = useNavigate()

    const searchClick = (ticker) => {
        setSearchText("")
        navigator(`/ticker/${ticker.toLowerCase()}`)

    }


    return (
        <div>
            <input value={searchText} onChange={inputSearch}/>
            {results.length>0&&searchText.length>0?
                <div className={classes.search_results_wrapper}>
                    {
                        results.map((val)=>{
                            return (<SearchTickerItem key={val.id} ticker={val.ticker} company_name={val.company_name} exchange={val.exchange} id={val.id} onClick={searchClick}/>)
                        })
                    }
                </div>:null

            }
        </div>
    );
};

export default TopBarSearch;