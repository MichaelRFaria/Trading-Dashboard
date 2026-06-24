import {addToWatchlist, deleteFromWatchlist} from "@/src/helper/api";
import {WatchlistRequest, WatchlistBasicResponse} from "@/src/types/watchlist";
import React from "react";

export default function WatchlistForm({getWatchlistDataAsync, setMessageType, setMessage}) {
    const modifyWatchlistFormSubmission = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault(); // prevent page refresh

        //console.log(authenticatedUser.sub)

        //console.log("form submit")
        const formData = new FormData(event.target);

        const request: WatchlistRequest = {
            stock_symbol: formData.get("stock_symbol") as string,
        }

        const action = formData.get("action") as string
        //console.log(action)

        let response: WatchlistBasicResponse;

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

        (response.success) ? setMessageType("success") : setMessageType("error")

        if (response.message) {
            setMessage(response.message)
        }

        getWatchlistDataAsync()
    }

    return (
        <>
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
        </>
    )
}