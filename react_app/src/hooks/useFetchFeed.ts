import PostsServices from "../services/postsServices/PostsService"
import {useEffect, useState} from "react";
import {IPost} from "../types/IPost";


const useFetchFeed = (start:number,
                      end:number,
                      sort:"new"|"popular",
                      interval:1|7|30|365,
                      ticker:boolean|string,
                      user:boolean|object,
                      isStoreLoading:boolean,
                      setStart:any) =>{



    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [posts, setPosts] = useState<IPost[]|undefined[]>([])
    const [isLast, setIsLast] = useState<boolean>(false)
    const [isTriggered, setIsTriggered] = useState(false)
    const [isFirstFetch, setIsFirstFetch] = useState(true)





    useEffect(()=>{
        if(isStoreLoading)return;
        if(isTriggered)return;
        setIsLoading(true)
        setIsFirstFetch(false)
        PostsServices.GetPosts(start, end, sort, interval, user, ticker)
            .then(async (res)=>{
                if(res.data.length < 1){
                    setIsLast(true)
                    return
                }else setIsLast(false)
                setPosts((prevState => [...prevState, ...res.data]))
            })
            .finally(()=>setIsLoading(false))
    },[start, isStoreLoading])

    useEffect(()=>{

        if(isStoreLoading)return;
        if(isFirstFetch)return;

        setIsLoading(true)
        setPosts([])
        setIsTriggered(true)
        setStart(0)
        const startTriggered:number = 0;

        PostsServices.GetPosts(startTriggered, end, sort, interval, user, ticker)
            .then(async (res)=>{



                if(res.data.length < 1){
                    setIsLast(true)
                    return
                }else setIsLast(false)
                setPosts((prevState => [...prevState, ...res.data]))


            })
            .finally(()=>{
                setIsLoading(false)
                setIsTriggered(false)
            })
    },[sort, interval, isStoreLoading, ticker])



    return {isLoading, posts, isLast}

}

export default useFetchFeed