export class WatchlistDataItem {
  id: number;
  stock_symbol: string;
  user_id: number;
}

export class ModifyWatchlistDto {
  stock_symbol: string;
}

export class DeleteFromWatchlistDto extends ModifyWatchlistDto {}

export class AddToWatchlistDto extends ModifyWatchlistDto {}
