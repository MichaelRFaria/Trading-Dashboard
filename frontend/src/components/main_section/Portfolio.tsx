import HoldingsList from '@/src/components/portfolio/HoldingsList';
import StockCards from '@/src/components/portfolio/StockCards';
import { HoldingsDataItem } from '@/src/types/trade';
import { FinnhubPriceChangesDataItem, HoldingsPrice } from '@/src/types/stock';

export default function Portfolio({
  holdingsData,
  holdingsPriceData,
  priceChangesData,
}: {
  holdingsData: HoldingsDataItem[];
  holdingsPriceData: HoldingsPrice;
  priceChangesData: FinnhubPriceChangesDataItem[];
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-5 sm:p-8">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-sky-400">
          Trading Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100">
          Portfolio
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Review your holdings and their current market value.
        </p>
      </div>
      <HoldingsList holdingsData={holdingsData} />
      <StockCards
        holdingsData={holdingsData}
        holdingsPriceData={holdingsPriceData}
        priceChangesData={priceChangesData}
      />
    </div>
  );
}
