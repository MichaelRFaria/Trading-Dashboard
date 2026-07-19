"use client";

import {
    finnhubPriceQuote,
    getCurrentUser,
    getGains,
    getHoldingsData,
    getPriceChanges,
    getWatchlistData
} from "@/src/helper/api";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import TradeForm from "@/src/components/TradeForm";
import FinnhubLookupForm from "@/src/components/FinnhubLookupForm";
import WatchlistForm from "@/src/components/WatchlistForm";
import Message from "@/src/components/Message";
import WatchlistList from "@/src/components/WatchlistList";
import {WatchlistDataItem, WatchlistResponse} from "@/src/types/watchlist";
import {HoldingsDataItem, TradeResponse} from "@/src/types/trade";
import HoldingsList from "@/src/components/HoldingsList";
import Metrics from "@/src/components/Metrics";
import {AuthenticatedUser} from "@/src/types/account";
import {
    FinnhubPriceChangesDataItem,
    FinnhubPriceChangesResponse,
    FinnhubPriceLookupRequest,
    FinnhubPriceLookupResponse, GainsResponse, HoldingsPrice
} from "@/src/types/stock";
import Navbar from "@/src/components/Navbar";
import {NavbarLink} from "@/src/types/misc";

export default function Dashboard() {
    const router = useRouter();

    const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser>({
        sub: 0,
        email: "",
        exp: 0,
        iat: 0
    })

    const [navbarLinks, setNavbarLinks] = useState<NavbarLink[]>([{text: "test", location: "/register"}, {
        text: "test",
        location: "/register"
    }, {text: "test", location: "/register"}])

    const [watchlistData, setWatchlistData] = useState<WatchlistDataItem[]>([])
    const [holdingsData, setHoldingsData] = useState<HoldingsDataItem[]>([])
    const [priceChangesData, setPriceChangesData] = useState<FinnhubPriceChangesDataItem[]>([])
    const [holdingsPriceData, setHoldingsPriceData] = useState<HoldingsPrice>({})
    const [gains, setGains] = useState<GainsResponse>({
        realised_gains: 0,
        unrealised_gains: 0
    })

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

    return (
        <div className="flex flex-col min-h-screen justify-center items-center">
            <Navbar navbarLinks={navbarLinks}/>
            <p className="text-xl underline">Dashboard</p>

            <WatchlistForm getWatchlistDataAsync={getWatchlistDataAsync} watchlistData={watchlistData}
                           setMessageType={setMessageType}
                           setMessage={setMessage}/>
            <WatchlistList watchlistData={watchlistData}/>
            <FinnhubLookupForm setMessageType={setMessageType} setMessage={setMessage}/>
            <TradeForm getHoldingsDataAsync={getHoldingsDataAsync} holdingsData={holdingsData}
                       setMessageType={setMessageType}
                       setMessage={setMessage}/>
            <HoldingsList holdingsData={holdingsData}/>
            <Metrics holdingsData={holdingsData} holdingsPriceData={holdingsPriceData} priceChangesData={priceChangesData} gains={gains}/>

            <Message type={messageType} message={message}/>
        </div>
    );
}

