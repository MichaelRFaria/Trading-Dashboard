import {useEffect, useState} from "react";
import {GainsResponse, HoldingsPrice, HoldingValue, StockSymbolLookupRequest} from "@/src/types/stock";
import {finnhubPriceQuote, getGains} from "@/src/helper/api";
import {parseNumberToDollars} from "@/src/helper/format";
import MetricStat from "@/src/components/MetricStat";
import {HoldingsDataItem} from "@/src/types/trade";


export default function Metrics({holdingsData}: {
    holdingsData: HoldingsDataItem[]
}) {
    const [holdingsPrice, setHoldingsPrice] = useState<HoldingsPrice>({})
    const [gains, setGains] = useState<GainsResponse>({
        realised_gains: 0,
        unrealised_gains: 0
    })

    useEffect(() => {
        getGains().then((r) => {
            //console.log(r)
            if (r) {
                setGains({
                    realised_gains: r.realised_gains,
                    unrealised_gains: r.unrealised_gains
                })
            } else {
                console.error("getGains() response was null, something went wrong")
            }
            //console.log(gains)
        })
        getPriceOfAllHoldings()
    }, [holdingsData]);

    const getPriceOfAllHoldings = async () => {
        console.log("getting price of holdings")
        const prices = await Promise.all(
            holdingsData.map(async (holding: HoldingsDataItem) => {
                const request: StockSymbolLookupRequest = {
                    stock_symbol: holding.stock_symbol
                }

                let price = await finnhubPriceQuote(request)

                if (price === null) {
                    console.error("something went wrong when getting the price in getPriceOfAllHoldings, response (price) is null, price has been set to 0 to prevent further errors")
                    price = 0
                }

                //console.log("holding data: " + holding)
                //console.log("price: " + price)

                return [holding.stock_symbol!, price] as const
            })
        )

        setHoldingsPrice(Object.fromEntries(prices))
    }

    const totalPortfolioValue = holdingsData.reduce((sum: number, holding: HoldingsDataItem) => {
        const price = holdingsPrice[holding.stock_symbol] ?? 0

        return sum + holding.quantity * price;
    }, 0);

    const largestPosition = holdingsData.reduce<HoldingValue>((largest: HoldingValue, holding: HoldingsDataItem) => {
        const holdingValue = holding.quantity * (holdingsPrice[holding.stock_symbol] ?? 0)

        if (largest.value < holdingValue) {
            return {
                stock_symbol: holding.stock_symbol,
                value: holdingValue
            }
        } else {
            return largest
        }
    }, {
        stock_symbol: "",
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
                <MetricStat text={"Total Gain/Loss (realised): "} stat={gains.realised_gains}
                            portfolioValue={totalPortfolioValue} percentage={false}/>
                <MetricStat text={"Total Gain/Loss (unrealised): "} stat={gains.unrealised_gains}
                            portfolioValue={totalPortfolioValue} percentage={true}/>
                <MetricStat text={"Total Gain/Loss (combined): "} stat={totalCombinedGains}
                            portfolioValue={totalPortfolioValue} percentage={false}/>
                <p>Largest Position: {parseNumberToDollars(largestPosition.value)} of {largestPosition.stock_symbol}</p>
                <p>Number of Holdings: {holdingsData.length}</p>
            </div>
        </>
    )
}