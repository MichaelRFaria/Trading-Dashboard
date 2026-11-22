import StockCard from '@/src/components/portfolio/StockCard';
import { HoldingsDataItem, HoldingsPricesData } from '@/src/types/holding';

export default function StockCards({
  holdingsData,
  priceData,
}: {
  holdingsData: HoldingsDataItem[];
  priceData: HoldingsPricesData;
}) {
  // useEffect(() => {
  //     console.log("holdingsData: ", holdingsData)
  //     console.log("holdingsPriceData: ", holdingsPriceData)
  //     console.log("priceChangesData: ", priceChangesData)
  // }, []);

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {holdingsData.map((holding) => {
        const symbol = holding.stock_symbol;
        const quantity = holding.quantity;
        const stockPrice = priceData[symbol];
        const currentPrice =
          stockPrice && 'current' in stockPrice ? stockPrice.current : 0;
        const priceChange =
          stockPrice && 'change' in stockPrice ? stockPrice.change : 0;

        const totalValue = (quantity * currentPrice).toFixed(2);

        const percentageChange = (
          stockPrice && 'percent_change' in stockPrice
            ? stockPrice.percent_change
            : 0
        ).toFixed(2);

        return (
          <StockCard
            key={holding.id}
            symbol={symbol}
            quantity={quantity}
            currentPrice={currentPrice}
            priceChange={priceChange}
            totalValue={totalValue}
            percentageChange={percentageChange}
          />
        );
      })}
    </div>
  );
}
