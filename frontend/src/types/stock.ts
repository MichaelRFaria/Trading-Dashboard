export type StockSymbolLookupRequest = {
  stock_symbol: string;
};

export type StockSymbolLookupResponse =
  StockSymbolLookupResponseSuccess | StockSymbolLookupResponseFailure;

export type StockSymbolLookupResponseSuccess = {
  description: string;
  stock_symbol: string;
  type: string;
};

export type StockSymbolLookupResponseFailure = {
  message: string;
  error: string;
  statusCode: number;
};

export type HoldingValue = {
  stock_symbol: string;
  value: number;
};

export type GainsResponse = {
  lifetime_realised_gains: number;
  lifetime_unrealised_gains: number;
  todays_realised_gains: number;
  todays_unrealised_gains: number;
};

export type FinnhubPriceLookupRequest = {
  stock_symbol: string;
};

export type FinnhubPriceLookupResponse =
  FinnhubPriceLookupResponseSuccess | FinnhubPriceLookupResponseFailure;

export type FinnhubPriceLookupResponseSuccess = {
  current: number;
  change: number;
  percent_change: number;
  high: number;
  low: number;
  open: number;
  previous_close: number;
};

export type PriceData = Record<
  string,
  FinnhubPriceLookupResponseSuccess | null
>;

export type FinnhubPriceLookupResponseFailure = {
  message: string;
  error: string;
  statusCode: number;
};
