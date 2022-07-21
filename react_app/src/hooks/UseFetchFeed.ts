import PostsServices from "../services/postsServices/PostsService"
import {useEffect, useState} from "react";



const useFetchChar = (start:number, end:number, sort:string, interval:number) =>{

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [data, setData] = useState(null)


    useEffect(()=>{
        setIsLoading(true)
        PostsServices.GetPosts(start, end, sort, interval)
            .then((res)=>setData(res.data))
            .finally(()=>setIsLoading(false))
    },[sort, interval])



    return {isLoading, data}

}

export default useFetchChar