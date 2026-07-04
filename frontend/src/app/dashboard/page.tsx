"use client";

import {
    getCurrentUser, getHoldingsData, getWatchlistData
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

    useEffect(() => {
        getWatchlistDataAsync()
        getHoldingsDataAsync()
    }, [authenticatedUser]);

    return (
        <div className="flex flex-col min-h-screen justify-center items-center">
            <p className="text-xl underline">Dashboard</p>

            <WatchlistForm getWatchlistDataAsync={getWatchlistDataAsync} setMessageType={setMessageType}
                           setMessage={setMessage}/>
            <WatchlistList watchlistData={watchlistData}/>
            <FinnhubLookupForm setMessageType={setMessageType} setMessage={setMessage}/>
            <TradeForm getHoldingsDataAsync={getHoldingsDataAsync} setMessageType={setMessageType}
                       setMessage={setMessage}/>
            <HoldingsList holdingsData={holdingsData}/>
            <Metrics holdingsData={holdingsData}/>

            <Message type={messageType} message={message}/>
        </div>
    );
}

