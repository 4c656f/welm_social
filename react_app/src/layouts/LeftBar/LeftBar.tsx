import React, {memo, useEffect, useState} from 'react';
import classes from "./LeftBar.module.css";
import { ReactComponent as BookMark } from "../../utils/svg/bookmark.svg"
import LeftBarItem from "../../components/ui/LeftBarItem/LeftBarItem";
import {useLocation, useNavigate} from "react-router-dom";


const initLeftBarElems = [{
        "active": true,
        "content": "posts",
        "children": <BookMark/>,
        "redirect": "/"
    },
    {
        "active": false,
        "content": "dashboard",
        "children": <BookMark/>,
        "redirect": "/dashboard"
    },
    {
        "active": false,
        "content": "saved posts",
        "children": <BookMark/>,
        "redirect": "/saved-posts"
    }
]


const LeftBar = () => {

    const [items, setItems] = useState(initLeftBarElems)

    const navigator = useNavigate()
    const location = useLocation()
    const clickRedirect = (to) => {
        setItems((prev)=>{
            const arr = prev.map((val)=>{
                const returnContainer = val
                if (val.redirect === to){
                    returnContainer["active"] = true
                    return returnContainer
                }
                returnContainer["active"] = false
                return returnContainer
            })
            return arr
        })
        navigator(to)
    }
    useEffect(()=>{
        setItems((prev)=>{
            const arr = prev.map((val)=>{
                const returnContainer = val
                if (val.redirect === location.pathname){
                    returnContainer["active"] = true
                    return returnContainer
                }
                returnContainer["active"] = false
                return returnContainer
            })
            return arr
        })
    },[location])


    return (
        <div className={classes.left_bar_wrapper}>

            {items.map((val)=>{
                return(
                    <div key={val.redirect} onClick={()=>{clickRedirect(val.redirect)}} className={`${classes.left_bar_item_wrapper} ${val.active?classes.left_bar_item_active:""}`}>
                        <LeftBarItem  content={val.content} active={val.active}>
                            {val.children}
                        </LeftBarItem>
                    </div>
                )
            })}



        </div>
    );
};

export default memo(LeftBar);