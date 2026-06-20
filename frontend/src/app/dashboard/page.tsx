"use client";

import {
    addToWatchlist,
    buyHolding,
    deleteFromWatchlist,
    finnhubStockSymbolLookup,
    getCurrentUser, getHoldingsData, getWatchlistData, sellHolding
} from "@/src/helper/api";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import TradeForm from "@/src/components/TradeForm";
import FinnhubLookupForm from "@/src/components/FinnhubLookupForm";
import WatchlistForm from "@/src/components/WatchlistForm";
import Message from "@/src/components/Message";
import WatchlistList from "@/src/components/WatchlistList";
import {WatchlistBasicResponse, WatchlistResponse} from "@/src/types/watchlist";
import {TradeResponse} from "@/src/types/trade";
import HoldingsList from "@/src/components/HoldingsList";

export default function Dashboard() {
    const router = useRouter();

    const [authenticatedUser, setAuthenticatedUser] = useState(null)

    const [watchlistData, setWatchlistData] = useState([])
    const [holdingsData, setHoldingsData] = useState([])


    const [messageType, setMessageType] = useState("success")
    const [message, setMessage] = useState("")

    useEffect(() => {
        getCurrentUser().then(user => {
            if (user) {
                setAuthenticatedUser(user)
            } else {
                router.push("/home")
            }
        })
    }, [])

    const getWatchlistDataAsync = async () => {
        const watchlist: WatchlistResponse = await getWatchlistData()
        //console.log(watchlistData)

        if (Array.isArray(watchlist)) {
            setWatchlistData(watchlist)
        } else {
            setMessageType(watchlist.success)
            setMessage(watchlist.message)
        }
    }

    const getHoldingsDataAsync = async () => {
        const holdings: TradeResponse = await getHoldingsData()

        if (Array.isArray(holdings)) {
            setHoldingsData(holdings)
        } else {
            setMessageType(holdings.success)
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

            <WatchlistForm setMessageType={setMessageType} setMessage={setMessage}/>
            <WatchlistList watchlistData={watchlistData}/>
            <FinnhubLookupForm setMessageType={setMessageType} setMessage={setMessage}/>
            <HoldingsList holdingsData={holdingsData}/>
            <TradeForm setMessageType={setMessageType} setMessage={setMessage}/>

            <Message type={messageType} message={message}/>
        </div>
    );
}

