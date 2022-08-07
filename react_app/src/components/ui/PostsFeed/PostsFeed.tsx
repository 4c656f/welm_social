import React, {FC, memo, useEffect, useRef, useState} from 'react';
import useFetchFeed from "../../../hooks/useFetchFeed";
import PostCategorySwitcher from "../PostCategorySwitcher/PostCategorySwitcher";
import PostSmallExample from "../PostSmallExampl/PostSmallExample";
import classes from "./PostsFeed.module.css"
import SmallSpinnerLoader from "../SmallSpinnerLoader/SmallSpinnerLoader";
import {toJS} from "mobx";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {useStores} from "../../../store";
import PostTextArea from "../PostTextArea/PostTextArea";

interface FeedProps{
    ticker: string|boolean;
}



const PostsFeed:FC<FeedProps> = ({ticker}) => {



    const [start, setStart]= useState(0)
    const end = 5
    const [sort, setSort]= useState<"new" | "popular">("new")
    const [interval, setInterval]= useState<1 | 7 | 30 | 365>(1)

    const {UserStore} = useStores();




    const {posts, isLoading, isLast} = useFetchFeed(start,
                                                    end,
                                                    sort,
                                                    interval,
                                                    ticker,
                                                    toJS(UserStore.user),
                                                    UserStore.isLoading,
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

                setStart((prevState) => {
                    return prevState+5
                })
            }

        }

        observer.current = new  IntersectionObserver(callback)
        observer.current.observe(lastElem.current)
    }, [isLoading, isLast]);

    const navigator = useNavigate()

    return (
        <div className={classes.feed_container}>

            <PostTextArea ticker={ticker}/>
            <div className={classes.post_container}>
                <PostCategorySwitcher sort={sort} setSort={setSort} setInterval={setInterval}/>
                {posts.map((value) => {
                    return <PostSmallExample key={`post${value.id}`} post={value} navigator={navigator} isFull={false}/>
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

export default memo(observer(PostsFeed));