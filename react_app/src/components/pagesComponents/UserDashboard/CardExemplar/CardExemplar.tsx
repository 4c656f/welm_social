import React, {FC} from 'react';



interface CardExemplarProps {
    price: {
        close: number,
        open: number,
    }
    ticker:string;
    isPercent:boolean;
    setIsPercent:void;
}


const CardExemplar:FC<CardExemplarProps> = ({price, ticker}) => {
    return (
        <div>
            
        </div>
    );
};

export default CardExemplar;