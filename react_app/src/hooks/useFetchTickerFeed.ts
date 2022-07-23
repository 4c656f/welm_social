import PostsServices from "../services/postsServices/PostsService"
import {useEffect, useState} from "react";
import {IPost} from "../types/IPost";






const useFetchTickerFeed = (start:number, end:number,setStart:any,setEnd:any, sort:string, interval:number, ticker:string) =>{

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [posts, setPosts] = useState<IPost[]|undefined[]>([])
    const [isLast, setIsLast] = useState<boolean>(false)




    useEffect(()=>{
        setPosts([])
        },[sort,interval]
    )


    useEffect(()=>{

        setIsLoading(true)

        PostsServices.GetTickerPosts(start, end, sort, interval, ticker)
            .then((res)=>{

                if(res.data.length < 1){
                    setIsLast(true)
                    return
                }else setIsLast(false)
                setPosts((prevState => [...prevState, ...res.data]))

            })
            .finally(()=>setIsLoading(false))
    },[sort,interval, start])



    return {isLoading, posts, isLast}

}

export default useFetchTickerFeed