import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export type TradeHolding = BuyHoldingDto | SellHoldingDto;

export class TradeHoldingDto {
  @IsString()
  stock_symbol: string;

  @IsNumber()
  @Min(0.00000001) // this is the minimum number allowed in the frontend form when buying a stock, and must mirror the value used there
  quantity: number;
}

export class BuyHoldingDto extends TradeHoldingDto {}

export class SellHoldingDto extends TradeHoldingDto {}

export class GainsDto {
  @IsNumber()
  realised_gains: number;

  @IsNumber()
  unrealised_gains: number;
}

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
