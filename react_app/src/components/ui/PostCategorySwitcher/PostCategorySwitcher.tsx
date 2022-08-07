import React, {FC, memo} from 'react';
import Selector from "../Selector/Selector";
import classes from "./PostCategorySwitcher.module.css"

interface PostCategorySwitcherProps{
    sort:string;
    setSort: any;
    setInterval:any;
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

const PostCategorySwitcher:FC<PostCategorySwitcherProps> = ({sort, setSort, setInterval}) => {




    return (
        <div className={classes.main_container}>
            <Selector initState={"new"} options={CategoryOptions} setFc={setSort} />
            {sort==="popular"?
                <Selector initState={"day"} options={IntervalOptions} setFc={setInterval} />:
                null

            }

        </div>
    );
};

export default memo(PostCategorySwitcher);