import FinnhubLookupForm from "@/src/components/trade/FinnhubLookupForm";
import TradeForm from "@/src/components/trade/TradeForm";
import {useState} from "react";
import Message from "@/src/components/common/Message";

export default function Trade({holdingsData, getHoldingsDataAsync}) {
    const [messageType, setMessageType] = useState("success")
    const [message, setMessage] = useState("")

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