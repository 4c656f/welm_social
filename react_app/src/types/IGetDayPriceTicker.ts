import {IDashboardElem} from "./IDashboardElem";

export interface IGetDayPriceTicker{
    tickers: {"ticker":string}[]|IDashboardElem[];
    period:boolean|"1d"|"1mo"|"1y"|"max";
}