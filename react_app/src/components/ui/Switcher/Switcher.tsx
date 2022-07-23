import React, {FC,memo} from 'react';
import classes from "./Switcher.module.css"
import SwitcherButton from "./SwitcherButton";

interface IButtonSwitcherProps{
    content: string;
    width?:string;
    isFetching?:boolean;
    isDisabled?:boolean
    isActive?:boolean
}


interface switcherProps{
    buttonObject: IButtonSwitcherProps[] | any;
    setButtonsFc:(value: IButtonSwitcherProps[] | ((prevVar: IButtonSwitcherProps[]) => IButtonSwitcherProps[])) => IButtonSwitcherProps[]| any;
    setValFc:(value: string | ((prevVar: string) => string)) => string | any;
    placeholder:string | any;
}
const Switcher:FC<switcherProps> = ({buttonObject, setButtonsFc, setValFc, placeholder}) => {

    const switcher = (content) => {

        setButtonsFc((prev)=>{
            return prev.map((val)=>{
                const container = {...val};
                if (val.content === content){
                    container["isDisabled"] = true
                    container["isActive"] = true
                    return container
                }
                container["isDisabled"] = false
                container["isActive"] = false
                return container
            })
        })
        setValFc(content)

    }





    return (
        <div className={classes.container}>
            <div className={classes.placeholder}>
                {placeholder}
            </div>
            {
                buttonObject.map((val)=>{
                    return(
                    <SwitcherButton key={val.content}
                            onClick={switcher}
                            content={val.content}
                            isActive={val.isActive}
                            isDisabled={val.isDisabled}
                            width={val.width}
                    />
                    )
                })
            }
        </div>
    );
};

export default memo(Switcher);