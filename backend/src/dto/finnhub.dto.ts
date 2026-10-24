import { IsNumber, IsString } from 'class-validator';

export class FinnhubSymbolLookupDto {
  @IsString()
  stock_symbol: string;
}

export class FinnhubPriceLookupDto {
  @IsString()
  stock_symbol: string;
}

export class FinnhubPriceResponseDto {
  current: number;
  change: number;
  percent_change: number;
  high: number;
  low: number;
  open: number;
  previous_close: number;
}

export class FinnhubPriceChangeDataItemDto {
  @IsString()
  stock_symbol: string;

  @IsNumber()
  price_change: number;
}
