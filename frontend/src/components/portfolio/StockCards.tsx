import StockCard from '@/src/components/portfolio/StockCard';
import { HoldingsDataItem } from '@/src/types/trade';
import { FinnhubPriceChangesDataItem, HoldingsPrice } from '@/src/types/stock';

export default function StockCards({
  holdingsData,
  holdingsPriceData,
  priceChangesData,
}: {
  holdingsData: HoldingsDataItem[];
  holdingsPriceData: HoldingsPrice;
  priceChangesData: FinnhubPriceChangesDataItem[];
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
        const currentPrice = holdingsPriceData[symbol];
        const priceChange =
          priceChangesData.find((holding) => holding.stock_symbol === symbol)
            ?.price_change ?? 0;

        const totalValue = (quantity * currentPrice).toFixed(2);

        const percentageChange = (
          (priceChange / (currentPrice + priceChange)) *
          100
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
