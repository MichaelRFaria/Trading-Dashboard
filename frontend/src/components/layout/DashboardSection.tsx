import Dashboard from "@/src/components/main_section/Dashboard";
import Portfolio from "@/src/components/main_section/Portfolio";
import Watchlist from "@/src/components/main_section/Watchlist";
import Trade from "@/src/components/main_section/Trade";
import History from "@/src/components/main_section/History";
import {useRouter} from "next/navigation";
import {useCallback, useEffect, useState} from "react";
import {AuthenticatedUser} from "@/src/types/account";
import {WatchlistDataItem} from "@/src/types/watchlist";
import {HoldingsDataItem} from "@/src/types/trade";
import {
    FinnhubPriceChangesDataItem,
    FinnhubPriceLookupRequest,
    FinnhubPriceLookupResponse,
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
    const [message, setMessage] = useState<string>("")
    const [messageType, setMessageType] = useState<"success" | "error" | "">("success")
    const [isLoading, setIsLoading] = useState<boolean>(true)

    // check if the user is authenticated
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
    }, [router])

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [watchlist, holdings, priceChanges, gainsData] = await Promise.all([getWatchlistData(), getHoldingsData(), getPriceChanges(), getGains()])

            if (watchlist && "data" in watchlist) setWatchlistData(watchlist.data);
            if (holdings && "data" in holdings) setHoldingsData(holdings.data);
            if (priceChanges && "data" in priceChanges) setPriceChangesData(priceChanges.data);
            if (gainsData) setGains(gainsData);
        } catch (error) {
            console.error("Error when fetching dashboard data", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // once user has been authenticated, fetch dashboard data
    useEffect(() => {
        if (authenticatedUser.sub !== 0) {
            fetchDashboardData();
        }
    }, [authenticatedUser, fetchDashboardData]);

    useEffect(() => {
        // if holdingsData is empty, then we cannot get the price of each holding
        if (holdingsData.length === 0) return;

        const getHoldingsPricesAsync = async () => {
            console.log("getting price of holdings")
            const prices = await Promise.all(
                holdingsData.map(async (holding: HoldingsDataItem) => {
                    const request: FinnhubPriceLookupRequest = {
                        stock_symbol: holding.stock_symbol,
                        type: "current"
                    }

                    const response: FinnhubPriceLookupResponse | null = await finnhubPriceQuote(request)
                    const price = response?.price ?? 0

                    // console.log("holding data: " + holding)
                    // console.log("price: " + price)

                    return [holding.stock_symbol!, price] as const
                })
            )

            setHoldingsPriceData(Object.fromEntries(prices))
        }

        getHoldingsPricesAsync()
    }, [holdingsData]);

    if (isLoading) return <p>Loading...</p>

    switch (activeSection) {
        case "dashboard":
            return <Dashboard holdingsData={holdingsData} holdingsPriceData={holdingsPriceData}
                              priceChangesData={priceChangesData} gains={gains}/>
        case "portfolio":
            return <Portfolio holdingsData={holdingsData}/>
        case "watchlist":
            return <Watchlist watchlistData={watchlistData} getWatchlistDataAsync={fetchDashboardData}/>
        case "trade":
            return <Trade holdingsData={holdingsData} getHoldingsDataAsync={fetchDashboardData}/>
        case "history":
            return <History/>
    }
}