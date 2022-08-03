import React, {FC, memo, useEffect, useState} from 'react';
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {ITickerCharData} from "../../../types/ITickerChar";
import CustomTooltip from "../CustomTooltip/CustomTooltip";
import classes from "./Chart.module.css";

interface ChartProps{
    char_data: ITickerCharData[];
    isLoading: boolean;
}

const Chart:FC<ChartProps> = ({char_data,isLoading}) => {



    const [isFirstLoading, setIsFirstLoading] = useState(true)

    function get_len(){
        return char_data.length -2
    }

    useEffect(()=>{
        if(isLoading)return;
        if(!isFirstLoading)return;
        setIsFirstLoading(false)
    },[isLoading])


    return (
        <>
        {
            isLoading?
                isFirstLoading?
                    <div className={`${classes.char_container} loader_bg`}>

                    </div>
                    :
                    <div className={classes.char_container}>
                        <ResponsiveContainer width={"100%"} height={"100%"}>
                            <LineChart width={730} height={250} data={char_data}>
                                <Tooltip isAnimationActive={false} allowEscapeViewBox={{x: true, y: true}} position={{y: 0}} content={<CustomTooltip />} />
                                <Line dot={false} isAnimationActive={true} type="basis" dataKey="price" stroke="#fff" />

                                <XAxis tickLine={false} dataKey="date" interval={get_len()} className={"x_axis"} padding={{right: 50 , left: 50 }} axisLine={false}/>
                                <YAxis tickLine={false} dataKey="price" interval={0} className={"x_axis"} padding={{top: 50 , bottom: 50 }} axisLine={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                :
                <div className={classes.char_container}>
                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <LineChart width={730} height={250} data={char_data}>
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