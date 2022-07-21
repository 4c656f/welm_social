import React, {FC, useEffect, useState} from 'react';
import UseFetchFeed from "../../../hooks/UseFetchFeed";

interface FeedProps{
    type: "main" | "saved" | "stock"
    ticker?: string;
}



const Feed:FC<FeedProps> = ({type, ticker}) => {

    const [start, setStart]= useState(0)
    const [end, setEnd]= useState(5)
    const [sort, setSort]= useState<"new" | "popular">("new")
    const [interval, setInterval]= useState<1 | 7 | 30 | 365>(1)

    const{data, isLoading} = UseFetchFeed(start, end, sort, interval)


    useEffect(()=>{console.log(data)},[data])


    return (
        <div>

        </div>
    );
};

export default Feed;