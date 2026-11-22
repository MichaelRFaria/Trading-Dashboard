import { FinnhubPriceLookupResponse } from '@/src/types/stock';

export type HoldingsData = {
  data: HoldingsDataItem[];
};
export type HoldingsDataItem = {
  id: number;
  stock_symbol: string;
  quantity: number;
  user_id: number;
};

export type HoldingsPricesResponse = {
  data: Record<string, FinnhubPriceLookupResponse>;
};

export type HoldingsPricesData = Record<string, FinnhubPriceLookupResponse>;
