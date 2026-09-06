export default function StockCard({symbol, quantity, currentPrice, priceChange, totalValue, percentageChange}) {
    return (
        <div>
            <p>{symbol}</p>
            <p>{quantity}</p>
            <p>{currentPrice}</p>
            <p>{priceChange}</p>
            <p>{totalValue}</p>
            <p>{percentageChange}</p>
        </div>
    )
}