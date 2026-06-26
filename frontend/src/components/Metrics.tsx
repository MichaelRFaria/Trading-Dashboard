import {useEffect, useState} from "react";
import {HoldingsPrice, StockSymbolLookupRequest} from "@/src/types/stock";
import {finnhubPriceQuote} from "@/src/helper/api";


export default function Metrics({holdingsData}) {
    const [holdingsPrice, setHoldingsPrice] = useState<HoldingsPrice>({})

    useEffect(() => {
        getPriceOfAllHoldings()
    }, []);

    const getPriceOfAllHoldings = async () => {
        const prices = await Promise.all(
            holdingsData.map(async (holding) => {
                const request: StockSymbolLookupRequest = {
                    stock_symbol: holding.stock_symbol
                }

                const price = await finnhubPriceQuote(request)
                console.log("holding data: " + holding)
                console.log("price: " + price)

                return [holding.stock_symbol!, price] as const
            })
        )

        setHoldingsPrice(Object.fromEntries(prices))
    }
    const totalPortfolioValue = holdingsData.reduce((sum, holding) => {
        const price = holdingsPrice[holding.stock_symbol] ?? 0

        return sum + holding.quantity * price;
    }, 0);


    useEffect(() => {
        console.log(holdingsPrice);
    }, [holdingsPrice]);

    return (
        <>
            <div className="flex flex-col items-center">
                <p>Portfolio Value:{totalPortfolioValue}</p>
                <p>Today's Gain/Loss:</p>
                <p>Total Gain/Loss:</p>
                <p>Largest Position</p>
                <p>Number of Holdings: {holdingsData.length}</p>
            </div>
        </>
    )
}