export default function WatchlistList({watchlistData}) {
    if (watchlistData.length <= 0) {
        //console.log(watchlistData)
        return <p>Add some items to your watchlist to view them</p>
    }

    return (
        <>
            <p>Watchlist:</p>
            <table>
                <thead>
                <tr>
                    <th>Index</th>
                    <th>Stocks</th>
                </tr>
                </thead>

                <tbody>
                {watchlistData.map((item, index) =>
                    <tr>
                        <td>{index + 1}</td>
                        <td>{item.stock_symbol}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </>
    )
}