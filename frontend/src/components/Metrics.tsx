import {useEffect, useState} from "react";
import {HoldingsPrice, StockSymbolLookupRequest} from "@/src/types/stock";
import {finnhubPriceQuote, getGains} from "@/src/helper/api";
import {parseNumberToDollars} from "@/src/helper/format";


export default function Metrics({holdingsData}) {
    const [holdingsPrice, setHoldingsPrice] = useState<HoldingsPrice>({})
    const [gains, setGains] = useState({
        realised_gains: 0,
        unrealised_gains: 0
    })

    useEffect(() => {
        getGains().then((r) => {
            console.log(r)
            setGains({
                realised_gains: r.realised_gains,
                unrealised_gains: r.unrealised_gains
            })
            console.log(gains)
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

    const totalCombinedGains = gains.unrealised_gains + gains.realised_gains

    if (holdingsData.length === 0) {
        return <p>Loading...</p>
    }

    return (
        <>
            {/*todo use table for these*/}
            <div className="flex flex-col items-center">
                <p>Portfolio Value: {parseNumberToDollars(totalPortfolioValue)}</p>
                <p>Today's Gain/Loss:</p>
                <p>Total Gain/Loss (realised): {parseNumberToDollars(gains.realised_gains)}</p>
                <p>Total Gain/Loss (unrealised): {parseNumberToDollars(gains.unrealised_gains)}</p>
                <p>Total Gain/Loss (combined): {parseNumberToDollars(totalCombinedGains)}</p>
                <p>Largest Position: {parseNumberToDollars(largestPosition.value)} of {largestPosition.stock_symbol}</p>
                <p>Number of Holdings: {holdingsData.length}</p>
            </div>
        </>
    )
}