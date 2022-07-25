import PostsServices from "../services/postsServices/PostsService"
import {useEffect, useState} from "react";
import {IPost} from "../types/IPost";






const useFetchFeed = (start:number,
                      end:number,
                      setStart:any,
                      setEnd:any,
                      sort:"new"|"popular",
                      interval:1|7|30|365,
                      ticker:boolean|string,
                      user:boolean|object,
                      isStoreLoading:boolean) =>{



    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [posts, setPosts] = useState<IPost[]|undefined[]>([])
    const [isLast, setIsLast] = useState<boolean>(false)





    useEffect(()=>{
        setPosts([])
        },[sort,interval]
    )


    useEffect(()=>{
        if(isStoreLoading){

            return
        }
        setIsLoading(true)

        PostsServices.GetPosts({start, end, sort, interval, user, ticker})
            .then((res)=>{

                if(res.data.length < 1){
                    setIsLast(true)
                    return
                }else setIsLast(false)
                setPosts((prevState => [...prevState, ...res.data]))

            })
            .finally(()=>setIsLoading(false))
    },[sort,interval, start, isStoreLoading])



    return {isLoading, posts, isLast}

}

export default useFetchFeed