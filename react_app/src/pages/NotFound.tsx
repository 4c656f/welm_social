import React, {FC, useEffect} from 'react';
import {useNavigate} from "react-router-dom";

const NotFound:FC = () => {

    const navigator = useNavigate()

    useEffect(()=>{
        navigator("not-found")
    },[])

    return (
        <div style={{color:"white"}}>
            NotFound
        </div>
    );
};

export default NotFound;