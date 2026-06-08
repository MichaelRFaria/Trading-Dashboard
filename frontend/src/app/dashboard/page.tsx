"use client";

import {addToWatchlist, deleteFromWatchlist, finnhubStockSymbolLookup} from "@/src/app/_helper/api";
import {useState} from "react";

type WatchlistRequest = {
    stock_symbol: string,
    user_id: string,
}

type WatchlistResponse = {
    success: boolean,
    message: string,
}

type StockSymbolLookupRequest = {
    stock_symbol: string,
}

type StockSymbolLookupResponse = {
    count: number,
    result: StockSymbolLookupResponseResult[],
}

type StockSymbolLookupResponseResult = {
    description: string,
    displaySymbol: string,
    symbol: string,
    type: string,
}

export default function Dashboard() {
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const modifyWatchlistFormSubmission = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault(); // prevent page refresh

        //console.log("form submit")
        const formData = new FormData(event.target);

        const request: WatchlistRequest = {
            stock_symbol: formData.get("stock_symbol") as string,
            user_id: "1" as string, // todo temp, change when sessions are implemented
        }

        const action = formData.get("action") as string
        //console.log(action)

        let response: WatchlistResponse;

        switch (action) {
            case "add":
                response = await addToWatchlist(request)
                break;
            case "delete":
                response = await deleteFromWatchlist(request)
                break;
            default:
                response = {
                    success: false,
                    message: "Request not sent. Something went wrong."
                }
        }

        if (response.success) {
            setSuccessMessage(response.message)
            setErrorMessage("")
        } else if (response.message) {
            setErrorMessage(response.message)
            setSuccessMessage("")
        }
    }

    const finnhubLookupFormSubmission = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault(); // prevent page refresh

        console.log("form submit")
        const formData = new FormData(event.target);

        const request: StockSymbolLookupRequest = {
            stock_symbol: formData.get("stock_symbol") as string,
        }

        const response: StockSymbolLookupResponse = await finnhubStockSymbolLookup(request)

        console.log(response)
    }

        return (
        <div className="flex flex-col min-h-screen justify-center items-center">
            <p className="text-xl underline">Dashboard</p>
            <p className="text-bg underline">Add to Watchlist:</p>
            <form className="flex flex-col items-center" onSubmit={modifyWatchlistFormSubmission}>
                <div className="flex justify-between min-w-full">
                    <label htmlFor="stock_symbol">Stock symbol:</label>
                    <input name="stock_symbol" id="stock_symbol" type="text"/>
                </div>
                <div className="flex justify-between min-w-full">
                    <label htmlFor="action">Action:</label>
                    <select name="action" id="action">
                        <option value="add">Add</option>
                        <option value="delete">Delete</option>
                    </select>
                </div>
                <input type="submit" value="Execute"/>
            </form>

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

            <p className="text-green-600">{successMessage}</p>
            <p className="text-red-600">{errorMessage}</p>
        </div>
    );
}

