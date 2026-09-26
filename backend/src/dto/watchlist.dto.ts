import { IsString } from 'class-validator';

export class ModifyWatchlistDto {
  @IsString()
  stock_symbol: string;
}

export class DeleteFromWatchlistDto extends ModifyWatchlistDto {}

export class AddToWatchlistDto extends ModifyWatchlistDto {}
