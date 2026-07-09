"use client";

import {
    getCurrentUser, getHoldingsData, getPriceChanges, getWatchlistData
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
import {FinnhubPriceChangesDataItem, FinnhubPriceChangesResponse} from "@/src/types/stock";

export default function Dashboard() {
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

    const getWatchlistDataAsync = async () => {
        const watchlist: WatchlistResponse | null = await getWatchlistData()

        if (watchlist === null) {
            console.error("retrieved watchlist is null, something went wrong")
            return
        }

        // console.log(watchlist)

        if ("data" in watchlist) {
            setWatchlistData(watchlist.data)
        } else {
            setMessageType(watchlist?.success?.toString() || "false") // todo probably better way to do this
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
        } else {
            setMessageType(holdings?.success?.toString() || "false") // todo probably better way to do this
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

    useEffect(() => {
        getWatchlistDataAsync()
        getHoldingsDataAsync()
        getPriceChangesDataAsync()
    }, [authenticatedUser]);

    return (
        <div className="flex flex-col min-h-screen justify-center items-center">
            <p className="text-xl underline">Dashboard</p>

            <WatchlistForm getWatchlistDataAsync={getWatchlistDataAsync} watchlistData={watchlistData} setMessageType={setMessageType}
                           setMessage={setMessage}/>
            <WatchlistList watchlistData={watchlistData}/>
            <FinnhubLookupForm setMessageType={setMessageType} setMessage={setMessage}/>
            <TradeForm getHoldingsDataAsync={getHoldingsDataAsync} holdingsData={holdingsData}
                       setMessageType={setMessageType}
                       setMessage={setMessage}/>
            <HoldingsList holdingsData={holdingsData}/>
            <Metrics holdingsData={holdingsData}/>

            <Message type={messageType} message={message}/>
        </div>
    );
}

