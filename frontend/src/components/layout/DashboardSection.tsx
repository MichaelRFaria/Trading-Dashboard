import Dashboard from "@/src/components/main_section/Dashboard";
import Portfolio from "@/src/components/main_section/Portfolio";
import Watchlist from "@/src/components/main_section/Watchlist";
import Trade from "@/src/components/main_section/Trade";
import History from "@/src/components/main_section/History";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {AuthenticatedUser} from "@/src/types/account";
import {WatchlistDataItem, WatchlistResponse} from "@/src/types/watchlist";
import {HoldingsDataItem, TradeResponse} from "@/src/types/trade";
import {
    FinnhubPriceChangesDataItem,
    FinnhubPriceChangesResponse, FinnhubPriceLookupRequest, FinnhubPriceLookupResponse,
    GainsResponse,
    HoldingsPrice
} from "@/src/types/stock";
import {
    finnhubPriceQuote,
    getCurrentUser,
    getGains,
    getHoldingsData,
    getPriceChanges,
    getWatchlistData
} from "@/src/helper/api";

export default function DashboardSection({activeSection}) {
    const router = useRouter();

    const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>({
        sub: 0,
        email: "",
        exp: 0,
        iat: 0
    })

    const [watchlistData, setWatchlistData] = useState<WatchlistDataItem[]>([])
    const [holdingsData, setHoldingsData] = useState<HoldingsDataItem[]>([])
    const [priceChangesData, setPriceChangesData] = useState<FinnhubPriceChangesDataItem[]>([])
    const [holdingsPriceData, setHoldingsPriceData] = useState<HoldingsPrice>({})
    const [gains, setGains] = useState<GainsResponse>({
        realised_gains: 0,
        unrealised_gains: 0
    })

    // todo: message unused right now. message should become notification component probably
    const [messageType, setMessageType] = useState("success")
    const [message, setMessage] = useState("")

    useEffect(() => {
        getCurrentUser().then(user => {
            if (user) {
                // console.log("user response below")
                //console.log(user)
                setAuthenticatedUser(user)
            } else {
                router.push("/home")
            }
        })
    }, [])

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
        getHoldingsPricesAsync()
    }, [holdingsData]);

    const getWatchlistDataAsync = async () => {
        const watchlist: WatchlistResponse | null = await getWatchlistData()

        if (watchlist === null) {
            console.error("retrieved watchlist is null, something went wrong")
            return
        }

        // console.log(watchlist)

        if ("data" in watchlist) {
            setWatchlistData(watchlist.data)
        } else if ("success" in watchlist && "message" in watchlist) {
            (watchlist.success) ? setMessageType("success") : setMessageType("error")
            setMessage(watchlist.message)
        }
    }

    const getHoldingsDataAsync = async () => {
        const holdings: TradeResponse | null = await getHoldingsData()

        if (holdings === null) {
            console.error("retrieved holdings is null, something went wrong")
            return
        }

        // console.log(holdings)
        // console.log(holdings.data)

        if ("data" in holdings) {
            setHoldingsData(holdings.data)
            // console.log(holdingsData)
        } else if ("success" in holdings && "message" in holdings) {
            (holdings.success) ? setMessageType("success") : setMessageType("error")
            setMessage(holdings.message)
        }
    }

    const getPriceChangesDataAsync = async () => {
        const priceChanges: FinnhubPriceChangesResponse | null = await getPriceChanges()

        if (priceChanges === null) {
            console.error("retrieved price changes are null, something went wrong")
            return
        }

        console.log(priceChanges)
        console.log(priceChanges.data)

        if ("data" in priceChanges) {
            setPriceChangesData(priceChanges.data)
        }
    }

    const getHoldingsPricesAsync = async () => {
        console.log("getting price of holdings")
        const prices = await Promise.all(
            holdingsData.map(async (holding: HoldingsDataItem) => {
                const request: FinnhubPriceLookupRequest = {
                    stock_symbol: holding.stock_symbol,
                    type: "current"
                }

                const response: FinnhubPriceLookupResponse | null = await finnhubPriceQuote(request)

                let price = response?.price

                if (price === undefined) {
                    console.error("something went wrong when getting the price in getPriceOfAllHoldings, response (price) is null, price has been set to 0 to prevent further errors")
                    price = 0
                }

                //console.log("holding data: " + holding)
                //console.log("price: " + price)

                return [holding.stock_symbol!, price] as const
            })
        )

        setHoldingsPriceData(Object.fromEntries(prices))
    }

    useEffect(() => {
        getWatchlistDataAsync()
        getHoldingsDataAsync()
        getPriceChangesDataAsync()
        getHoldingsPricesAsync()
    }, [authenticatedUser]);

    switch (activeSection) {
        case "dashboard":
            return <Dashboard holdingsData={holdingsData} holdingsPriceData={holdingsPriceData} priceChangesData={priceChangesData} gains={gains}/>
        case "portfolio":
            return <Portfolio holdingsData={holdingsData}/>
        case "watchlist":
            return <Watchlist watchlistData={watchlistData} getWatchlistDataAsync={getWatchlistDataAsync}/>
        case "trade":
            return <Trade holdingsData={holdingsData} getHoldingsDataAsync={getHoldingsDataAsync()}/>
        case "history":
            return <History/>
    }
}