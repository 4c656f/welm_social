export interface IButtonProps{
    content: string;
    onClick: (params:any)=>any;
    width?:string;
    isFetching?:boolean;
    isDisabled?:boolean
    isActive?:boolean
}