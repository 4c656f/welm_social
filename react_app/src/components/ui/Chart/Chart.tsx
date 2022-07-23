import React, {FC, memo, useEffect} from 'react';
import {Tooltip, YAxis, XAxis, Line, LineChart, ResponsiveContainer} from "recharts";
import {ITickerChar} from "../../../types/ITickerChar";
import CustomTooltip from "../CustomTooltip/CustomTooltip";
import classes from "./Chart.module.css";

interface ChartProps{
    ticker:string;
    char_data: ITickerChar;
    isLoading: boolean;
}

const Chart:FC<ChartProps> = ({ticker,char_data,isLoading}) => {


    function get_len(){
        return char_data[ticker].length -2
    }


    return (
        <>
        {
            isLoading?
                <div className={`${classes.char_container} loader_bg`}>

                </div>
                :
                <div className={classes.char_container}>
                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <LineChart width={730} height={250} data={char_data[ticker]}>
                            <Tooltip isAnimationActive={false} allowEscapeViewBox={{x: true, y: true}} position={{y: 0}} content={<CustomTooltip />} />
                            <Line dot={false} isAnimationActive={true} type="basis" dataKey="price" stroke="#fff" />

                            <XAxis tickLine={false} dataKey="date" interval={get_len()} className={"x_axis"} padding={{right: 50 , left: 50 }} axisLine={false}/>
                            <YAxis tickLine={false} dataKey="price" interval={0} className={"x_axis"} padding={{top: 50 , bottom: 50 }} axisLine={false}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
        }
        </>

    );
};

export default memo(Chart);