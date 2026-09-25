export type TradeHolding = BuyHoldingDto | SellHoldingDto;

export class BuyHoldingDto {
  stock_symbol: string;
  quantity: number;
}

export class SellHoldingDto {
  stock_symbol: string;
  quantity: number;
}

export class GainsDto {
  realised_gains: number;
  unrealised_gains: number;
}

export class HistoryLookupDto {
  stock_symbol?: string;
  quantity_from?: number;
  quantity_to?: number;
  price_from?: number;
  price_to?: number;
  type?: 'buy' | 'sell';
  date_from?: string;
  date_to?: string;
}
