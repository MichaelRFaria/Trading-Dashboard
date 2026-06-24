export class ModifyWatchlistDto {
    stock_symbol: string;
}

export class DeleteFromWatchlistDto extends ModifyWatchlistDto {
}

export class AddToWatchlistDto extends ModifyWatchlistDto {
}