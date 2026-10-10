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

export type HoldingsPrice = Record<string, number>;

export type HoldingValue = {
  stock_symbol: string;
  value: number;
};

export type GainsResponse = {
  realised_gains: number;
  unrealised_gains: number;
};

export type FinnhubPriceLookupRequest = {
  stock_symbol: string;
  type: 'current' | 'change';
};

export type FinnhubPriceLookupResponse =
  FinnhubPriceLookupResponseSuccess | FinnhubPriceLookupResponseFailure;

export type FinnhubPriceLookupResponseSuccess = {
  price: number;
};

export type FinnhubPriceLookupResponseFailure = {
  message: string;
  error: string;
  statusCode: number;
};

export type FinnhubPriceChangesResponse = {
  data: FinnhubPriceChangesDataItem[];
};

export type FinnhubPriceChangesDataItem = {
  stock_symbol: string;
  price_change: number;
};
