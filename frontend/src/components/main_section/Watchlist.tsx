import WatchlistForm from "@/src/components/watchlist/WatchlistForm";
import WatchlistList from "@/src/components/watchlist/WatchlistList";
import Message from "@/src/components/common/Message";
import {useState} from "react";
import {WatchlistDataItem} from "@/src/types/watchlist";
import {MessageType} from "@/src/types/misc";

export default function Watchlist({watchlistData, getWatchlistDataAsync}: {
    watchlistData: WatchlistDataItem[], getWatchlistDataAsync: () => Promise<void>,
}) {
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState<MessageType>("success")

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