

export interface ITickerCharData{
    date: string
    price: number
}

export interface ITickerChar{
    [ ticker:string ]: ITickerCharData[];
}
