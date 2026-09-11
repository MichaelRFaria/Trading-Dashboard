import {HistoryDataItem} from "@/src/types/history";
import {useState} from "react";

const ITEMS_PER_PAGE = 10;

export default function HistoryList({historyData}: { historyData: HistoryDataItem[] }) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(historyData.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const slicedHistory = historyData.slice(startIndex, endIndex);


    if (historyData.length <= 0) {
        return <p>Make some trades to see your trade history or change the filters!</p>
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
                {slicedHistory.map((item: HistoryDataItem, index: number) =>
                    <tr key={item.id}>
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

            <div>
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                <span>
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </>
    )
}