import React, {FC, memo, useState} from 'react';


interface PostCategorySwitcherProps{
    sort:string;
    setSort: any;
    setInterval:any;
    interval:number
    setFeed:any
}


const PostCategorySwitcher:FC<PostCategorySwitcherProps> = ({sort, setSort, setInterval, interval, setFeed}) => {




    return (
        <div>
            <select value={sort} onChange={e => {setSort(e.target.value); setFeed()}}>
                <option value={"new"}>new</option>
                <option value={"popular"}>popular</option>
            </select>
            {sort==="popular"?
                <select value={interval} onChange={(e)=>{setInterval(Number(e.target.value)); setFeed()}}>
                    <option value={1}>day</option>
                    <option value={7}>week</option>
                    <option value={30}>month</option>
                    <option value={365}>year</option>
                </select>:

                null

            }

        </div>
    );
};

export default memo(PostCategorySwitcher);