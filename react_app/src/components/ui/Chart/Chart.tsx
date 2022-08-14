import React, {FC, memo, useEffect, useState} from 'react';
import {Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {ITickerCharData} from "../../../types/ITickerChar";
import CustomTooltip from "../CustomTooltip/CustomTooltip";
import classes from "./Chart.module.css";
import {IDayPrice} from "../../../types/IDayPrice";
import SmallSpinnerLoader from "../SmallSpinnerLoader/SmallSpinnerLoader";

interface ChartProps{
    char_data: ITickerCharData[];
    isLoading: boolean;
    setTooltipOpen:(value: number | ((prevVar: number) => number)) => number | any;
    setIsTooltip:(value: boolean | ((prevVal: boolean) => boolean)) => boolean;
}

const Chart:FC<ChartProps> = ({char_data,isLoading,setTooltipOpen, setIsTooltip}) => {


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
            isFirstLoading?
                <div className={`${classes.char_container} loader_bg`}>

                </div>

                :
                <div className={classes.char_container}>
                    {isLoading?
                        <SmallSpinnerLoader/>
                        :null
                    }
                    <ResponsiveContainer width={"100%"} height={"100%"}>
                        <LineChart width={730} height={250} data={char_data}>
                            <Tooltip isAnimationActive={false} allowEscapeViewBox={{x: true, y: true}} position={{y: 0}} content={<CustomTooltip setTooltipOpen={setTooltipOpen} setIsTooltip={setIsTooltip}/>} />
                            <Line dot={false} isAnimationActive={true} type="basis" dataKey="price" stroke="#fff" />

                            <XAxis tickLine={false} dataKey="date" interval={get_len()}  padding={{right: 50 , left: 50 }} axisLine={false} />
                            <YAxis tickLine={false} dataKey="price"  padding={{top: 50 , bottom: 50 }} axisLine={false} domain={['dataMin', 'dataMax']}/>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
        }
        </>

    );
};

export default memo(Chart);