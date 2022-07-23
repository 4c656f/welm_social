import React, {FC, memo, useEffect, useRef, useState} from 'react';
import useFetchTickerFeed from "../../../hooks/useFetchTickerFeed";
import PostCategorySwitcher from "../PostCategorySwitcher/PostCategorySwitcher";
import PostSmallExample from "../PostSmallExampl/PostSmallExample";
import classes from "./TickerFeed.module.css"
import SmallSpinnerLoader from "../SmallSpinnerLoader/SmallSpinnerLoader";

interface FeedProps{
    ticker: string;
}



const TickerFeed:FC<FeedProps> = ({ticker}) => {

    const [start, setStart]= useState(0)
    const [end, setEnd]= useState(5)
    const [sort, setSort]= useState<"new" | "popular">("new")
    const [interval, setInterval]= useState<1 | 7 | 30 | 365>(1)



    const{posts, isLoading, isLast} = useFetchTickerFeed(start, end, setStart, setEnd, sort, interval, ticker)




    const incriminateFeed = () => {

        setStart((prevState => prevState+5))
        setEnd((prevState => prevState+5))
    }
    const setFeedToZero = () => {
        setStart(0)
        setEnd(5)
    }


    const lastElem = useRef<any>();
    const observer = useRef<any>();

    useEffect(() => {

        if(isLoading) return;
        if(isLast){
            observer.current.disconnect()
            return;
        };
        if (observer.current)observer.current.disconnect();

        const callback = (entries) => {

            if(entries[0].isIntersecting){
                incriminateFeed()
            }

        }

        observer.current = new  IntersectionObserver(callback)
        observer.current.observe(lastElem.current)
    }, [isLoading, isLast]);




    return (
        <div className={classes.feed_container_my}>
            <PostCategorySwitcher sort={sort} setSort={setSort} setInterval={setInterval} interval={interval} setFeed={setFeedToZero}/>

            <div className={classes.post_container}>



                {posts.map((value) => {
                    return <PostSmallExample key={value.id} post={value}/>
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

export default memo(TickerFeed);