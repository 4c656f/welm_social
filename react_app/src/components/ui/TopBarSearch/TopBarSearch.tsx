import React, {useEffect, useState} from 'react';
import classes from "./TopBarSearch.module.css";
import StocksServices from "../../../services/stocksServices/StocksServices";
import {ITickerDescription} from "../../../types/ITickerDescription";
import SearchTickerItem from "../SearchTickerItem/SearchTickerItem";
import {useNavigate} from "react-router-dom";
import SmallSpinnerLoader from "../SmallSpinnerLoader/SmallSpinnerLoader";

const TopBarSearch = () => {

    const [searchText, setSearchText] = useState("")
    const [timer, setTimer] = useState(null)
    const [results, setResults] = useState([] as ITickerDescription[])
    const [isFetching, setIsFetching] = useState(false)
    const [selection, setSelection] = useState(0)


    const [isResults, setIsResults] = useState(false)


    const  inputSearch = (e) => {
        setSearchText(e.target.value)
        if(e.target.value.length < 1) {
            setResults([])
            setIsResults(false)
            return
        }
        clearTimeout(timer)
        const newTimer = setTimeout(async () => {
            setIsFetching(true)
            const resp = await StocksServices.GetTickerSearch(e.target.value)
            if(resp.data.length < 1) {
                setIsResults(false)
            }else{
                setIsResults(true)
            }
            setResults(resp.data)
            setIsFetching(false)
        }, 200)
        setSelection(0)
        setTimer(newTimer)
    }

    const navigator = useNavigate()

    const searchClick = (ticker) => {
        setSearchText("")
        navigator(`/ticker/${ticker.toLowerCase()}`)

    }

    const handleKeyDown = (event) => {
        const { which } = event;


        if (which === 40 ) {
            if(results.length < 1)return;
            event.preventDefault();
            setSelection((prev)=>{
                return (prev + 1) % results.length
            })
        }
        if (which === 38 ) {
            if(results.length < 1)return;
            event.preventDefault();
            if(selection<1){
                setSelection(results.length-1)
                return;
            }
            setSelection((prev)=>{
                if(prev<1)return 0
                return prev - 1
            })
        }

        if (which === 13) {
            if(results.length < 1)return;

            event.preventDefault();
            setIsResults(false)
            setSearchText("")
            setResults([])
            navigator(`/ticker/${results[selection]["ticker"].toLowerCase()}`)

            setSelection(0)


        }
    }

    const onInputBlur = () => {
        setIsResults(false)
    }
    const onInputFocus = ()=>{
        if(results.length < 1){
            return
        }
        setIsResults(true)

    }

    useEffect(()=>{console.log(selection)},[selection])
    return (
        <div>
            <div className={classes.input_container}>
                <input className={`default_input`}
                       placeholder={"search"}
                       value={searchText}
                       onChange={inputSearch}
                       onKeyDown={handleKeyDown}
                       onFocus={onInputFocus}


                />
                {isFetching?
                    <SmallSpinnerLoader/>
                    :null}
            </div>

            {isResults?
                <>
                    <div className={classes.search_results_wrapper} tabIndex={1} onKeyDown={handleKeyDown}>
                        {
                            results.map((val, index)=>{
                                return (<SearchTickerItem
                                    key={val.id}
                                    ticker={val.ticker}
                                    company_name={val.company_name}
                                    exchange={val.exchange}
                                    id={val.id}
                                    onClick={searchClick}
                                    selection={selection}
                                    index={index}

                                    />

                                )
                            })
                        }
                    </div>
                    <div className={classes.background} onClick={onInputBlur}>

                    </div>
                </>
                :null

            }


        </div>
    );
};

export default TopBarSearch;