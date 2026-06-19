import {buyHolding, sellHolding} from "@/src/helper/api";
import {TradeRequest, TradeResponse} from "@/src/types/trade";

export default function TradeForm({setMessageType, setMessage}) {
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

        (response.success) ? setMessageType("success") : setMessageType("error")

        if (response.message) {setMessage(response.message)}
    }

    return (
        <>
            <p className="text-bg underline">Trade stocks:</p>
            <form className="flex flex-col items-center" onSubmit={tradeStocksFormSubmission}>
                <div className="flex justify-between min-w-full">
                    <label htmlFor="stock_symbol">Stock symbol:</label>
                    <input name="stock_symbol" id="stock_symbol" type="text"/>
                    <label htmlFor="quantity">Quantity:</label>
                    <input name="quantity" id="quantity" type="number" min="0.00000001"
                           step="0.00000001"/> {/*todo add max based on what stock symbol is presented above. could work like - stock symbol is a dropdown of all the users holdings and the value is stored in a state, useEffect so when state changes it fetches the amount of the stock the user has and sets the max to that (for selling at least) */}
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
        </>
    )
}