"use client";

import {
    addToWatchlist,
    buyHolding,
    deleteFromWatchlist,
    finnhubStockSymbolLookup,
    getCurrentUser, sellHolding
} from "@/src/helper/api";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import TradeForm from "@/src/components/TradeForm";
import FinnhubLookupForm from "@/src/components/FinnhubLookupForm";
import WatchlistForm from "@/src/components/WatchlistForm";
import Message from "@/src/components/Message";

export default function Dashboard() {
    const router = useRouter();

    const [authenticatedUser, setAuthenticatedUser] = useState(null)

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

    return (
        <div className="flex flex-col min-h-screen justify-center items-center">
            <p className="text-xl underline">Dashboard</p>

            <WatchlistForm setMessageType={setMessageType} setMessage={setMessage}/>
            <FinnhubLookupForm setMessageType={setMessageType} setMessage={setMessage}/>
            <TradeForm setMessageType={setMessageType} setMessage={setMessage}/>

            <Message type={messageType} message={message}/>
        </div>
    );
}

