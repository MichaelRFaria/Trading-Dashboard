import { IsString, IsNumber } from 'class-validator';

export class FinnhubSymbolLookupDto {
  @IsString()
  stock_symbol: string;
}

export class FinnhubPriceLookupDto {
  @IsString()
  stock_symbol: string;

  @IsString()
  type: 'current' | 'change';
}

export class FinnhubPriceChangeDataItemDto {
  @IsString()
  stock_symbol: string;

  @IsNumber()
  price_change: number;
}
