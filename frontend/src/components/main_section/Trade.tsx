import FinnhubLookupForm from '@/src/components/trade/FinnhubLookupForm';
import TradeForm from '@/src/components/trade/TradeForm';

import {HoldingsDataItem} from "@/src/types/holding";

export default function Trade({
  holdingsData,
  getHoldingsDataAsync,
}: {
  holdingsData: HoldingsDataItem[];
  getHoldingsDataAsync: () => Promise<void>;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-5 sm:p-8">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-sky-400">
          Trading Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100">
          Trade
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Look up a stock or place a buy or sell order.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <FinnhubLookupForm />
        <TradeForm
          getHoldingsDataAsync={getHoldingsDataAsync}
          holdingsData={holdingsData}
        />
      </div>
    </div>
  );
}
