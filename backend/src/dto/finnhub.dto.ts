import { IsNumber, IsString } from 'class-validator';

export class FinnhubSymbolLookupDto {
  @IsString()
  stock_symbol: string;
}

export class FinnhubPriceLookupDto extends FinnhubSymbolLookupDto {}

export class FinnhubPriceChangeDataItemDto extends FinnhubSymbolLookupDto {
  @IsNumber()
  price_change: number;
}

export class FinnhubExchangeLookupDto {
  @IsString()
  exchange: string;
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
