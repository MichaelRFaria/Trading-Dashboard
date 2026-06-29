import {useEffect, useState} from "react";
import {HoldingsPrice, StockSymbolLookupRequest} from "@/src/types/stock";
import {finnhubPriceQuote, getRealisedGains} from "@/src/helper/api";


export default function Metrics({holdingsData}) {
    const [holdingsPrice, setHoldingsPrice] = useState<HoldingsPrice>({})
    const [realisedGains, setRealisedGains] = useState(0)

    useEffect(() => {
        getRealisedGains().then((r) => {
            setRealisedGains(r)
        })
        getPriceOfAllHoldings()
    }, [holdingsData]);

    const getPriceOfAllHoldings = async () => {
        console.log("getting price of holdings")
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

    const largestPosition = holdingsData.reduce((largest, holding) => {
        const holdingValue = holding.quantity * (holdingsPrice[holding.stock_symbol] ?? 0)

        if (!largest || largest.value < holdingValue) {
            return {
                stock_symbol: holding.stock_symbol,
                value: holdingValue
            }
        } else {
            return largest
        }
    }, {
        stock_symbol: null,
        value: 0
    })

    if (holdingsData.length === 0) {
        return <p>Loading...</p>
    }

    return (
        <>
            {/*todo use table for these*/}
            <div className="flex flex-col items-center">
                <p>Portfolio Value: {totalPortfolioValue}</p>
                <p>Today's Gain/Loss:</p>
                <p>Total Gain/Loss (realised): {realisedGains}</p>
                <p>Total Gain/Loss (unrealised):</p>
                <p>Total Gain/Loss (combined):</p>
                <p>Largest Position: {largestPosition.value} of {largestPosition.stock_symbol}</p>
                <p>Number of Holdings: {holdingsData.length}</p>
            </div>
        </>
    )
}