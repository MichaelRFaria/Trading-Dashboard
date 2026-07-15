import {useEffect, useState} from "react";
import {
    FinnhubPriceChangesDataItem,
    FinnhubPriceLookupRequest,
    GainsResponse,
    HoldingsPrice,
    HoldingValue
} from "@/src/types/stock";
import {finnhubPriceQuote, getGains} from "@/src/helper/api";
import {parseNumberToDollars} from "@/src/helper/format";
import MetricStat from "@/src/components/MetricStat";
import {HoldingsDataItem} from "@/src/types/trade";


export default function Metrics({holdingsData, priceChangesData}: {
    holdingsData: HoldingsDataItem[],
    priceChangesData: FinnhubPriceChangesDataItem[],
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
                const request: FinnhubPriceLookupRequest = {
                    stock_symbol: holding.stock_symbol,
                    type: "current"
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

    // calculates today's gains by iterating through the user's holdings and multiplying the quantity of each stock by its change in price
    const todaysGains = holdingsData.reduce((sum: number, holding: HoldingsDataItem) => {
        const priceChange = priceChangesData.find(stock => stock.stock_symbol === holding.stock_symbol)?.price_change ?? 0

        const gain = priceChange * holding.quantity

        return sum + gain
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
        <table>
            <tbody>
            <MetricStat text={"Portfolio Value:"} stat={totalPortfolioValue} format="currency"/>
            <MetricStat text={"Today's Gain/Loss:"} stat={todaysGains} format="gain"/>
            <MetricStat text={"Total Gain/Loss (realised):"} stat={gains.realised_gains} format="gain"/>
            <MetricStat text={"Total Gain/Loss (unrealised):"} stat={gains.unrealised_gains}
                        format="gainWithPercentage"
                        portfolioValue={totalPortfolioValue}/>
            <MetricStat text={"Total Gain/Loss (combined):"} stat={totalCombinedGains} format="gain"/>
            <MetricStat text={"Largest Position:"}
                        stat={parseNumberToDollars(largestPosition.value) + " of " + largestPosition.stock_symbol}
                        format="text"/>
            <MetricStat text={"Number of Holdings:"} stat={holdingsData.length} format="text"/>
            </tbody>
        </table>
    )
}