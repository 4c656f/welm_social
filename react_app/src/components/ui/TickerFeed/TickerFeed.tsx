import React, {FC, memo, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import useFetchFeed from "../../../hooks/useFetchFeed";
import PostCategorySwitcher from "../PostCategorySwitcher/PostCategorySwitcher";
import PostSmallExample from "../PostSmallExampl/PostSmallExample";
import classes from "./TickerFeed.module.css"
import SmallSpinnerLoader from "../SmallSpinnerLoader/SmallSpinnerLoader";
import {Context} from "../../../index";
import {toJS} from "mobx";
import {observer} from "mobx-react-lite";

interface FeedProps{
    ticker: string;
}



const TickerFeed:FC<FeedProps> = ({ticker}) => {


    const [allPropsInOne, setAllPropsInOne] = useState({
        "start": 0,
        "ticker": ticker,
        "sort": "new",
        "interval": 1
    })
    const [start, setStart]= useState(0)
    const end = 5
    const [sort, setSort]= useState<"new" | "popular">("new")
    const [interval, setInterval]= useState<1 | 7 | 30 | 365>(1)

    const {store} = useContext(Context)

    const setFeedToZero = () => {
        console.log("reset_feed-----")
        setStart(0)
    }


    useLayoutEffect(() => {

        setStart(0)
    },[ticker])



    const {posts, isLoading, isLast} = useFetchFeed(start,
                                                    end,
                                                    sort,
                                                    interval,
                                                    ticker,
                                                    toJS(store.user),
                                                    store.isLoading,
                                                    setStart)









    const lastElem = useRef<any>();
    const observer = useRef<any>();

    useEffect(() => {

        if(isLoading) return;
        if(isLast){
            if(observer.current)observer.current.disconnect();
            return;
        };
        if (observer.current)observer.current.disconnect();

        const callback = (entries) => {

            if(entries[0].isIntersecting){
                console.log("increment worked------")
                setStart((prevState) => {
                    return prevState+5
                })
            }

        }

        observer.current = new  IntersectionObserver(callback)
        observer.current.observe(lastElem.current)
    }, [isLoading, isLast]);




    return (
        <div className={classes.feed_container_my}>
            <PostCategorySwitcher sort={sort} setSort={setSort} setInterval={setInterval} setFeed={setFeedToZero}/>

            <div className={classes.post_container}>



                {posts.map((value) => {
                    return <PostSmallExample key={`post${value.id}`} post={value}/>
                }
                )}
                {isLoading?
                    <div className={classes.loader_container}>
                        <SmallSpinnerLoader/>
                    </div>
                    :null
                }
                {isLast?
                    <div className={classes.breaker}>
                        that all
                    </div>:null
                }

            </div>
            {
                isLoading?
                    null:
                    <div className={classes.last_elem} ref={lastElem}></div>
            }


        </div>
    );
};

export default memo(observer(TickerFeed));