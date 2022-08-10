import React, {FC, memo, ReactNode} from 'react';
import classes from "./LeftBarItem.module.css";

interface LeftBarItemProps{
    content:string;
    children: ReactNode;
    active:boolean
}

const LeftBarItem:FC<LeftBarItemProps> = ({active,content,children}) => {

    return (
        <>
            <>
                {children}
            </>
            <div className={`no_select ${classes.left_bar_item_text}`}>
                {content}
            </div>
        </>
    );
};

export default memo(LeftBarItem);