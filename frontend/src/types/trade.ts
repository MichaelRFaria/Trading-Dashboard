import { HoldingsData } from '@/src/types/holding';

export type TradeRequest = {
  stock_symbol: string;
  quantity: number;
};

export type TradeResponse = TradeBasicResponse | HoldingsData;

export type TradeBasicResponse = {
  success: boolean;
  message: string;
};
