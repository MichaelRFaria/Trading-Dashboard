import {buyHolding, sellHolding} from "@/src/helper/api";
import {HoldingsDataItem, TradeBasicResponse, TradeRequest} from "@/src/types/trade";
import React, {useEffect, useState} from "react";

export default function TradeForm({getHoldingsDataAsync, holdingsData, setMessageType, setMessage}: {
    getHoldingsDataAsync: () => Promise<void>,
    holdingsData: HoldingsDataItem[],
    setMessageType: React.Dispatch<React.SetStateAction<string>>,
    setMessage: React.Dispatch<React.SetStateAction<string>>
}) {
    const [tradeType, setTradeType] = useState("buy")
    const [selectedStock, setSelectedStock] = useState("")

    useEffect(() => {
        // if the user no longer has holdings (they have sold their last holding), set trade type to buy
        if (holdingsData.length === 0) {
            setTradeType("buy")
            return
        }

        // if the selectedStock state is no longer in their holdingsData (they have sold all their shares in the holding),
        // then set the selected stock to the first stock in their holdingsData
        if (!holdingsData.find(stock => stock.stock_symbol === selectedStock)) {
            setSelectedStock(holdingsData[0].stock_symbol)
        }

    }, [holdingsData]);

    const selectedStockObj = holdingsData.find(stock => stock.stock_symbol === selectedStock)

    const selectedStockMaxQuantity = selectedStockObj?.quantity ?? 0

    const tradeStocksFormSubmission = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault(); // prevent page refresh

        //console.log(authenticatedUser.sub)

        //console.log("form submit")

        const formData = new FormData(event.target);

        const request: TradeRequest = {
            stock_symbol: formData.get("stock_symbol") as string,
            quantity: parseFloat(formData.get("quantity") as string) as number,
        }

        console.log(request)

        let response: TradeBasicResponse | null

        if (request.quantity > selectedStockMaxQuantity && tradeType === "sell") {
            setMessageType("error")
            setMessage("You cannot sell more shares than you own.")
            return;
        }

        switch (tradeType) {
            case "buy":
                response = await buyHolding(request)
                break;
            case "sell":
                response = await sellHolding(request)
                break;
            default:
                console.error("trade form's action value was unexpected, something went wrong")
                return
        }

        //console.log(response)
        // console.log("trade form test")

        if (response === null) {
            console.error("holdings trade response is null, something went wrong")
            return
        }

        (response.success) ? setMessageType("success") : setMessageType("error")

        if (response.message) {
            setMessage(response.message)
        }

        getHoldingsDataAsync()
    }

    return (
        <>
            <p className="text-bg underline">Trade stocks:</p>
            <form className="flex flex-col items-center" onSubmit={tradeStocksFormSubmission}>
                <div className="flex justify-between min-w-full">
                    <label htmlFor="stock_symbol">Stock symbol:</label>
                    {tradeType === "buy" ? (
                        <>
                            <input name="stock_symbol" id="stock_symbol" type="text"/>
                            <label htmlFor="quantity">Quantity:</label>
                            <input name="quantity" id="quantity" type="number" min="0.00000001"
                                   step="0.00000001"/>
                        </>) : (
                        <>
                            <select name="stock_symbol" id="stock_symbol"
                                    onChange={e => setSelectedStock(e.target.value)}>
                                {holdingsData.map((item: HoldingsDataItem) =>
                                    <option value={item.stock_symbol}>{item.stock_symbol}</option>
                                )}
                            </select>
                            <label htmlFor="quantity">Quantity:</label>
                            <input name="quantity" id="quantity" type="number" min="0.00000001"
                                   step="0.00000001"/>
                        </>)}
                </div>
                <div className="flex justify-between min-w-full">
                    <label htmlFor="action">Action:</label>
                    <select name="action" id="action" onChange={e => {
                        setTradeType(e.target.value)
                    }}>
                        <option value="buy">Buy</option>
                        {(holdingsData.length > 0) &&
                            (<option value="sell">Sell</option>)

                        }
                    </select>
                </div>
                <input type="submit" value="Execute"/>
            </form>
        </>
    )
}