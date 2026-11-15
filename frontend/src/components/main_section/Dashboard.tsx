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
    <div className="flex flex-col justify-center items-center">
      <Metrics
        holdingsData={holdingsData}
        holdingsPriceData={priceData}
        gains={gains}
        accountsData={accountsData}
      />
    </div>
  );
}
