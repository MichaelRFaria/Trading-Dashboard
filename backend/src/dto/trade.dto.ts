import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export type TradeHolding = BuyHoldingDto | SellHoldingDto;

export class BuyHoldingDto {
  @IsString()
  stock_symbol: string;

  @IsNumber()
  @Min(0.00000001)
  quantity: number;
}

export class SellHoldingDto {
  @IsString()
  stock_symbol: string;

  @IsNumber()
  quantity: number;
}

export class GainsDto {
  @IsNumber()
  realised_gains: number;

  @IsNumber()
  unrealised_gains: number;
}

import { Type } from 'class-transformer';

export class HistoryLookupDto {
  @IsString()
  @IsOptional()
  stock_symbol?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  quantity_from?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  quantity_to?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  price_from?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  price_to?: number;

  @IsString()
  @IsOptional()
  type?: 'buy' | 'sell';

  @IsString()
  @IsOptional()
  date_from?: string;

  @IsString()
  @IsOptional()
  date_to?: string;
}