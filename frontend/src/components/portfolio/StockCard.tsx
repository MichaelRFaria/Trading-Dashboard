export default function StockCard({symbol, quantity, currentPrice, priceChange, totalValue, percentageChange}: {
    symbol: string,
    quantity: number,
    currentPrice: number,
    priceChange: number,
    totalValue: number,
    percentageChange: number
}) {
    return (
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#23272d] p-5 text-white shadow-md">
            <p className="text-xl font-bold">{symbol}</p>
            <p className="text-right text-sm text-gray-400">{quantity} shares</p>

            <p className="text-lg font-semibold">${currentPrice}</p>
            <p className="text-right text-lg font-semibold">${totalValue}</p>

            <p className="text-sm">{priceChange}</p>
            <p className="text-right text-sm">{percentageChange}%</p>
        </div>
    )
}