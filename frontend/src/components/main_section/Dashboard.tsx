'use client';

import Metrics from '@/src/components/portfolio/Metrics';
import { HoldingsDataItem } from '@/src/types/trade';
import { GainsResponse, PriceData } from '@/src/types/stock';
import { AccountsListItem } from '@/src/types/account';

export default function Dashboard({
  holdingsData,
  priceData,
  gains,
  accountsData,
}: {
  holdingsData: HoldingsDataItem[];
  priceData: PriceData;
  gains: GainsResponse;
  accountsData: AccountsListItem[];
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-5 sm:p-8">
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-sky-400">
          Trading Dashboard
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100">
          Overview
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          A summary of your portfolio performance and holdings.
        </p>
      </div>
      <Metrics
        holdingsData={holdingsData}
        holdingsPriceData={priceData}
        gains={gains}
        accountsData={accountsData}
      />
    </div>
  );
}
