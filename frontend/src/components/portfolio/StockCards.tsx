import {useEffect} from "react";
import StockCard from "@/src/components/portfolio/StockCard";

export default function StockCards({holdingsData, holdingsPriceData, priceChangesData}) {
    useEffect(() => {
        console.log("holdingsData: ", holdingsData)
        console.log("holdingsPriceData: ", holdingsPriceData)
        console.log("priceChangesData: ", priceChangesData)
    }, []);
    return (
        <div className="grid grid-cols-2 gap-4 h-screen">
            {holdingsData.map((holding) => {
                const symbol = holding.stock_symbol
                const quantity = holding.quantity
                const currentPrice = holdingsPriceData[symbol]
                const priceChange = priceChangesData.find(holding => holding.stock_symbol === symbol)?.price_change ?? 0

                const totalValue = quantity * currentPrice

                const percentageChange = (priceChange / (currentPrice + priceChange)) * 100

                return <StockCard key={holding.id} symbol={symbol} quantity={quantity} currentPrice={currentPrice}
                                  priceChange={priceChange} totalValue={totalValue}
                                  percentageChange={percentageChange}/>
            })}
        </div>
    )
}