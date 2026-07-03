import {HoldingsDataItem} from "@/src/types/trade";

export default function HoldingsList({holdingsData}: {holdingsData: HoldingsDataItem[]}) {
    if (holdingsData.length <= 0) {
        return <p>Add some items to your holdings to view them</p>
    }

    return (
        <>
            <p>Holdings:</p>
            <table>
                <thead>
                <tr>
                    <th>Index</th>
                    <th>Stock Symbol</th>
                    <th>Quantity</th>
                </tr>
                </thead>

                <tbody>
                {holdingsData.map((item: HoldingsDataItem, index: number) =>
                    <tr>
                        <td>{index + 1}</td>
                        <td>{item.stock_symbol}</td>
                        <td>{item.quantity}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    )
}