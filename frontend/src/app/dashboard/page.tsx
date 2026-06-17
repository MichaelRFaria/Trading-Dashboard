"use client";

import {
    addToWatchlist,
    buyHolding,
    deleteFromWatchlist,
    finnhubStockSymbolLookup,
    getCurrentUser, sellHolding
} from "@/src/app/_helper/api";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

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

type TradeRequest = {
    stock_symbol: string,
    quantity: number,
}

type TradeResponse = {
    success: boolean,
    message: string,
}

export default function Dashboard() {
    const router = useRouter();

    const [authenticatedUser, setAuthenticatedUser] = useState(null)

    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
        getCurrentUser().then(user => {
            if (user) {
                setAuthenticatedUser(user)
            } else {
                router.push("/home")
            }
        })
    }, [])

    const modifyWatchlistFormSubmission = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault(); // prevent page refresh

        //console.log(authenticatedUser.sub)

        //console.log("form submit")
        const formData = new FormData(event.target);

        const request: WatchlistRequest = {
            stock_symbol: formData.get("stock_symbol") as string,
            user_id: (authenticatedUser.sub).toString() as string,
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

        //console.log(response)

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

        if (response) { // todo add error flow when a stock is not found
            setSuccessMessage(JSON.stringify(response))
        }
    }

    const tradeStocksFormSubmission = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault(); // prevent page refresh

        //console.log(authenticatedUser.sub)

        //console.log("form submit")
        const formData = new FormData(event.target);

        const request: TradeRequest = {
            stock_symbol: formData.get("stock_symbol") as string,
            quantity: parseFloat(formData.get("quantity") as string) as number,
        }

        console.log(request.quantity)

        const action = formData.get("action")
        let response: TradeResponse

        switch (action) {
            case "buy":
                response = await buyHolding(request)
                break;
            case "sell":
                response = await sellHolding(request)
                break;
            default:
                response = {
                    success: false,
                    message: "Request not sent. Something went wrong."
                }
        }

        //console.log(response)

        if (response.success) {
            setSuccessMessage(response.message)
            setErrorMessage("")
        } else if (response.message) {
            setErrorMessage(response.message)
            setSuccessMessage("")
        }
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

            <p className="text-bg underline">Trade stocks:</p>
            <form className="flex flex-col items-center" onSubmit={tradeStocksFormSubmission}>
                <div className="flex justify-between min-w-full">
                    <label htmlFor="stock_symbol">Stock symbol:</label>
                    <input name="stock_symbol" id="stock_symbol" type="text"/>
                    <label htmlFor="quantity">Quantity:</label>
                    <input name="quantity" id="quantity" type="number" min="0.00000001" step="0.00000001"/> {/*todo add max based on what stock symbol is presented above. could work like - stock symbol is a dropdown of all the users holdings and the value is stored in a state, useEffect so when state changes it fetches the amount of the stock the user has and sets the max to that (for selling at least) */}
                </div>
                <div className="flex justify-between min-w-full">
                    <label htmlFor="action">Action:</label>
                    <select name="action" id="action">
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                    </select>
                </div>
                <input type="submit" value="Execute"/>
            </form>

            <p className="text-green-600">{successMessage}</p>
            <p className="text-red-600">{errorMessage}</p>
        </div>
    );
}

