import {HistoryDataItem} from "@/src/types/history";

export default function HistoryList({historyData}: { historyData: HistoryDataItem[] }) {
    if (historyData.length <= 0) {
        return <p>Make some trades to see your trade history!</p>
    }

    return (
        <>
            <p>History:</p>
            <table>
                <thead>
                <tr>
                    <th>Index</th>
                    <th>ID</th>
                    <th>Stock Symbol</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Type</th>
                    <th>Date</th>
                </tr>
                </thead>

                <tbody>
                {historyData.map((item: HistoryDataItem, index: number) =>
                    <tr>
                        <td>{index + 1}</td>
                        <td>{item.id}</td>
                        <td>{item.stock_symbol}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                        <td>{item.type}</td>
                        <td>{item.createdAt}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    )
}