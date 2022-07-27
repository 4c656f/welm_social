import React, {FC, memo, useState} from 'react';
import classes from "./PostCategorySwitcher.module.css";
import Selector from "../Selector/Selector";

interface PostCategorySwitcherProps{
    sort:string;
    setSort: any;
    setInterval:any;
    setFeed:any;
}
const CategoryOptions = [
    {
        "optionText": "new",
        "value": "new"
    },
    {
        "optionText": "popular",
        "value": "popular"
    }
]
const IntervalOptions = [
    {
        "optionText": "day",
        "value": 1
    },
    {
        "optionText": "week",
        "value": 7
    },
    {
        "optionText": "month",
        "value": 30
    },
    {
        "optionText": "year",
        "value": 360
    }
]

const PostCategorySwitcher:FC<PostCategorySwitcherProps> = ({sort, setSort, setInterval, setFeed}) => {




    return (
        <div>
            <Selector initState={"new"} options={CategoryOptions} setFc={setSort} setFeed={setFeed}/>
            {sort==="popular"?
                <Selector initState={"day"} options={IntervalOptions} setFc={setInterval} setFeed={setFeed}/>:
                null

            }

        </div>
    );
};

export default memo(PostCategorySwitcher);