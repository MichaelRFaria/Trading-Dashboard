import FinnhubLookupForm from "@/src/components/trade/FinnhubLookupForm";
import TradeForm from "@/src/components/trade/TradeForm";
import {useState} from "react";
import Message from "@/src/components/common/Message";
import {HoldingsDataItem} from "@/src/types/trade";
import {MessageType} from "@/src/types/misc";

export default function Trade({holdingsData, getHoldingsDataAsync}: {
    holdingsData: HoldingsDataItem[], getHoldingsDataAsync: () => Promise<void>,
}) {
    const [message, setMessage] = useState("")
    const [messageType, setMessageType] = useState<MessageType>("success")

    return (
        <div className="flex flex-col justify-center items-center">
            <FinnhubLookupForm setMessageType={setMessageType} setMessage={setMessage}/>
            <TradeForm getHoldingsDataAsync={getHoldingsDataAsync} holdingsData={holdingsData}
                       setMessageType={setMessageType}
                       setMessage={setMessage}/>
            <Message type={messageType} message={message}/>
        </div>
    )
}