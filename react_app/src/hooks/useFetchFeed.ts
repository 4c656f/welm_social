import PostsServices from "../services/postsServices/PostsService"
import {useEffect, useLayoutEffect, useState} from "react";
import {IPost} from "../types/IPost";
import { useWhatChanged } from '@simbathesailor/use-what-changed';





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




    useLayoutEffect(()=>{
        setPosts([])
    },[sort,interval, ticker])
    useEffect(() => {

        },)


    let deps = [sort, interval, start, isStoreLoading, ticker]
    useWhatChanged(deps, 'sort, interval, start, isStoreLoading, ticker');
    useEffect(()=>{

        if(isStoreLoading)return
        setIsLoading(true)

        PostsServices.GetPosts({start, end, sort, interval, user, ticker})
            .then(async (res)=>{

                console.log(start, end, "fetch----------", ticker, posts)

                if(res.data.length < 1){
                    setIsLast(true)
                    return
                }else setIsLast(false)
                await setPosts((prevState => [...prevState, ...res.data]))


            })
            .finally(()=>setIsLoading(false))
    },deps)



    return {isLoading, posts, isLast}

}

export default useFetchFeed