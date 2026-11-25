import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum PriceTypeDto {
  BUY_BELOW = 'buy_below',
  SELL_ABOVE = 'sell_above',
  OMIT = 'omit',
}

export class ModifyWatchlistDto {
  @IsString()
  stock_symbol: string;
}

export class DeleteFromWatchlistDto extends ModifyWatchlistDto {}

export class WatchlistDetailsDto extends ModifyWatchlistDto {
  @IsOptional()
  @IsEnum(PriceTypeDto)
  price_type?: PriceTypeDto;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  price_target?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class AddToWatchlistDto extends WatchlistDetailsDto {}

export class UpdateWatchlistDto extends WatchlistDetailsDto {}
