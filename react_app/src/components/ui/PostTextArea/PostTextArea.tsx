import React, {ChangeEvent, FC, useEffect, useRef, useState} from 'react';
import classes from "./PostTextArea.module.css"
import InputTrigger from 'react-input-trigger';
import Suggestions from "./Suggestions/Suggestions";
import {ITickerDescription} from "../../../types/ITickerDescription";
import Button from "../Button/Button";
import {useStores} from "../../../store";
import PostsService from "../../../services/postsServices/PostsService";
import autosize from 'autosize';



interface PostTextAreaProps {
    ticker?:string|boolean
}
interface metaData {
    hookType: string;
    text?:string;
    cursor: {
        selectionStart:number;
        selectionEnd:number;
        top:number;
        left:number;
        height:number;
    }
}


const PostTextArea:FC<PostTextAreaProps> = ({ticker}) => {



    const [placeholder, setPlaceholder] = useState("any thoughts?")

    const [isTextAreaActive, setIsTextAreaActive] = useState(false)

    const [textVal, setTextVal] = useState<string>("")

    const [isSuggestor, setIsSuggestor] = useState(false)
    const [top, setTop] = useState<number>(0)
    const [left, setLeft] = useState<number>(0)
    const [suggestionText, setSuggestionText] = useState("")
    const [curSelection, setCurSelection] = useState<number>(0)
    const [startSug, setStartSug] = useState<number>(0)
    const [endHandlerFc, setEndHandlerFc] = useState<any>(()=> ()=>{return})

    const [searchResults, setSearchResults] = useState([] as ITickerDescription[])

    const [isSubmitLoading, setIsSubmitLoading] = useState(false)

    const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)

    const textAreaRef = useRef(null);

    const {UserStore} = useStores()


    const restart = () => {
        setIsSuggestor(false)
        setLeft(0)
        setTop(0)
        setSuggestionText("")
        setStartSug(0)
        setCurSelection(0)
        setTextVal("")
        setSearchResults([])
        endHandlerFc()()
    }

    useEffect(()=>{
        if(!ticker)return
        setPlaceholder(`any thoughts about ${ticker}?`)
    },[ticker])

    useEffect(()=>{

        if(!ticker)return
        if(!isTextAreaActive)return
        setTextVal(`$${ticker}`)
    },[isTextAreaActive])

    useEffect(()=>{
        autosize(textAreaRef.current.element)
        if(textVal.length<1) {
            if(isTextAreaActive)return
            setIsTextAreaActive(false)
            return
        }
        setIsTextAreaActive(true)
    },[textVal])

    const textAreaChange = (e:ChangeEvent<HTMLTextAreaElement>) => {
        setTextVal(e.target.value.slice(0, 1000))
    }

    const textAreaFocus = () => {
        if(isTextAreaActive)return
        setIsTextAreaActive(true)
    }

    const triggerToggle = (metaData:metaData) => {
        const {hookType, cursor} = metaData

        if(hookType === "start"){
            setSuggestionText("")
            setIsSuggestor(true)
            setStartSug(metaData.cursor.selectionStart)
            setTop(cursor.top)
            setLeft(cursor.left)
            console.log("start")


        }
        if(hookType === "typing"){

            setSuggestionText(metaData.text.split(" ")[0])

        }
        if(hookType === "cancel"){


            setIsSuggestor(false)
            setLeft(0)
            setTop(0)
            setSuggestionText("")
            setStartSug(0)
            setCurSelection(0)
            setSearchResults([])
            endHandlerFc()()

        }
    }
    
    const handleKeyDown = (event) => {
        const { which } = event;


        if (which === 40 ) {
            if(!isSuggestor)return;
            event.preventDefault();
            setCurSelection((prev)=>{

                return (prev + 1) % searchResults.length
            })
        }
        if (which === 38 ) {
            if(!isSuggestor)return;
            event.preventDefault();
            setCurSelection((prev)=>{
                if(prev<1)return 0
                return prev - 1
            })
        }
        if (which === 32 ) {
            if(!isSuggestor)return;

            setIsSuggestor(false)
            setLeft(0)
            setTop(0)
            setSuggestionText("")

            setStartSug(0)
            setCurSelection(0)
            setSearchResults([])
            endHandlerFc()()
        }

        if (which === 9) {
            if(!isSuggestor)return;
            event.preventDefault();

            const ticker = "$" + searchResults[curSelection]["ticker"]+ " ";
            const newText = `${textVal.slice(0, startSug - 1)}${ticker}${textVal.slice(startSug + suggestionText.length , textVal.length)}`

            setIsSuggestor(false)
            setLeft(0)
            setTop(0)
            setSuggestionText("")
            setStartSug(0)
            setCurSelection(0)
            setTextVal(newText)
            setSearchResults([])
            endHandlerFc()()


        }
    }

    const publishPost = () => {
        if(textVal.length<1)return
        const wrapper = async () => {
            setIsSubmitLoading(true)
            const resp = await PostsService.AddPost(UserStore.user, textVal)
            setIsSubmitLoading(false)

            if(resp) {
                setIsSubmitSuccess(true)
                restart()
                setTimeout(()=>setIsSubmitSuccess(false), 900)
            }

        }
        UserStore.privateModalWrapper(wrapper)


    }


    return (
        <div className={classes.main_container}
             onKeyDown={handleKeyDown}
        >


            {isTextAreaActive?
                <div className={classes.counter}>
                    {`${textVal.length}/1000`}
                </div>
                :null
            }
            <InputTrigger
                trigger={{
                    keyCode: 52,
                    shiftKey: true

                }}
                onStart={triggerToggle}
                onType={triggerToggle}
                onCancel={triggerToggle}
                endTrigger={(endHandler) =>{setEndHandlerFc(()=> ()=> endHandler)}}
                ref={textAreaRef}
                className = {classes.text_area_container}
            >
                <textarea
                    placeholder={placeholder}
                    className={`default_input ${classes.text_area}`}

                    value={textVal}
                    onChange={textAreaChange}
                    onFocus={textAreaFocus}
                />
            </InputTrigger>
            {isTextAreaActive?


                <div className={classes.bottom_bar}>
                    <Button onClick={publishPost}  content={"submit"} isFetching={isSubmitLoading} isSuccess={isSubmitSuccess}/>
                </div>

                :null

            }

            {isSuggestor?
                <Suggestions
                    top={top}
                    left={left}
                    text={suggestionText}
                    selection={curSelection}
                    searchResults={searchResults}
                    setSearchResults={setSearchResults}
                />
                :
                null}
        </div>
    );
};

export default PostTextArea;