import WatchlistForm from "@/src/components/WatchlistForm";
import WatchlistList from "@/src/components/WatchlistList";
import Message from "@/src/components/Message";
import {useState} from "react";

export default function Watchlist({watchlistData, getWatchlistDataAsync}) {
    const [messageType, setMessageType] = useState("success")
    const [message, setMessage] = useState("")

    return (
        <div className="flex flex-col justify-center items-center">
            <WatchlistForm getWatchlistDataAsync={getWatchlistDataAsync} watchlistData={watchlistData}
                           setMessageType={setMessageType}
                           setMessage={setMessage}/>
            <WatchlistList watchlistData={watchlistData}/>
            <Message type={messageType} message={message}/>
        </div>
    )
}