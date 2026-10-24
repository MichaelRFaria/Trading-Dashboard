'use client';

import Metrics from '@/src/components/portfolio/Metrics';
import { HoldingsDataItem } from '@/src/types/trade';
import { GainsResponse, HoldingsPrice } from '@/src/types/stock';
import { AccountsListItem } from '@/src/types/account';

export default function Dashboard({
  holdingsData,
  holdingsPriceData,
  gains,
  accountsData,
}: {
  holdingsData: HoldingsDataItem[];
  holdingsPriceData: HoldingsPrice;
  gains: GainsResponse;
  accountsData: AccountsListItem[];
}) {
  return (
    <div className="flex flex-col justify-center items-center">
      <Metrics
        holdingsData={holdingsData}
        holdingsPriceData={holdingsPriceData}
        gains={gains}
        accountsData={accountsData}
      />
    </div>
  );
}
