import {finnhubStockSymbolLookup} from "@/src/helper/api";
import {StockSymbolLookupRequest, StockSymbolLookupResponse} from "@/src/types/stock";
import React from "react";

export default function FinnhubLookupForm({setMessageType, setMessage}: {
    setMessageType: React.Dispatch<React.SetStateAction<string>>,
    setMessage: React.Dispatch<React.SetStateAction<string>>
}) {
    const finnhubLookupFormSubmission = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault(); // prevent page refresh

        console.log("form submit")
        const formData = new FormData(event.target);

        const request: StockSymbolLookupRequest = {
            stock_symbol: formData.get("stock_symbol") as string,
        }

        const response: StockSymbolLookupResponse | null = await finnhubStockSymbolLookup(request)

        if (response) {
            setMessageType("success")
            setMessage(JSON.stringify(response))
        } else {
            setMessageType("error")
            setMessage(request.stock_symbol + " does not exist.")
        }
    }

    return (
        <>
            <p className="text-bg underline">Finnhub Lookup:</p>
            <form className="flex flex-col items-center" onSubmit={finnhubLookupFormSubmission}>
                <div className="flex justify-between min-w-full">
                    <label htmlFor="stock_symbol">Stock symbol:</label>
                    <input name="stock_symbol" id="stock_symbol" type="text"/>
                </div>
                <div className="flex justify-between min-w-full">
                    <label htmlFor="action">Action:</label>
                    <select name="action" id="action">
                        <option value="search">Search</option>
                    </select>
                </div>
                <input type="submit" value="Execute"/>
            </form>
        </>
    )
}