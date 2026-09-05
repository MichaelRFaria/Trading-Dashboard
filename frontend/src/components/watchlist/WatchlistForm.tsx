import {addToWatchlist, deleteFromWatchlist} from "@/src/helper/api";
import {WatchlistBasicResponse, WatchlistDataItem, WatchlistRequest} from "@/src/types/watchlist";
import React, {useEffect, useState} from "react";

export default function WatchlistForm({getWatchlistDataAsync, watchlistData, setMessageType, setMessage}: {
    getWatchlistDataAsync: () => Promise<void>,
    watchlistData: WatchlistDataItem[],
    setMessageType: React.Dispatch<React.SetStateAction<string>>,
    setMessage: React.Dispatch<React.SetStateAction<string>>
}) {
    const [actionType, setActionType] = useState("add")
    const [selectedStock, setSelectedStock] = useState("")

    useEffect(() => {
        // if the user no longer has holdings in their watchlist (they have deleted their last holding from the watchlist), set action type to add
        if (watchlistData.length === 0) {
            setActionType("add")
            return
        }

        // if the selectedStock state is no longer in their watchlistData (they have just deleted a holding from the watchlist),
        // then set the selected holding to the first holding in their watchlistData
        if (!watchlistData.find(stock => stock.stock_symbol === selectedStock)) {
            setSelectedStock(watchlistData[0].stock_symbol)
        }
    }, [watchlistData]);

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

        let response: WatchlistBasicResponse | null;

        if (request.stock_symbol === "" || !request.stock_symbol || !action) {
            setMessageType("error")
            setMessage("Invalid form inputs, please try again.")
            return
        }

        switch (action) {
            case "add":
                response = await addToWatchlist(request)
                break;
            case "delete":
                response = await deleteFromWatchlist(request)
                break;
            default:
                console.error("watchlist form's action value was unexpected, something went wrong")
                return
        }

        //console.log

        if (response === null) {
            console.error("watchlist modification response is null, something went wrong")
            return
        }

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
                    {actionType === "add" ? (<>
                            <label htmlFor="stock_symbol">Stock symbol:</label>
                            <input name="stock_symbol" id="stock_symbol" type="text"/></>)
                        :
                        (<>
                            <select name="stock_symbol" id="stock_symbol"
                                    onChange={e => setSelectedStock(e.target.value)}>
                                {watchlistData.map((item: WatchlistDataItem) =>
                                    <option value={item.stock_symbol}>{item.stock_symbol}</option>
                                )}
                            </select>
                        </>)
                    }
                </div>
                <div className="flex justify-between min-w-full">
                    <label htmlFor="action">Action:</label>
                    <select name="action" id="action" onChange={e => {
                        setActionType(e.target.value)
                    }}>
                        <option value="add">Add</option>
                        {(watchlistData.length > 0) &&
                            <option value="delete">Delete</option>
                        }
                    </select>
                </div>
                <input type="submit" value="Execute"/>
            </form>
        </>
    )
}