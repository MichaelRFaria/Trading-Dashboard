export class WatchlistFetchFailureDto {
    success: false;
    message: string;
}

export class WatchlistFetchSuccessDto {
    data: WatchlistDataItem[];
}

export class WatchlistDataItem {
    id: number;
    stock_symbol: string;
    user_id: number;
}

export class ModifyWatchlistDto {
    stock_symbol: string;
}

export class DeleteFromWatchlistDto extends ModifyWatchlistDto {
}

export class AddToWatchlistDto extends ModifyWatchlistDto {
}

export class ModifyWatchlistResultDto {
    success: boolean;
    message: string;
}

export class ModifyWatchlistSuccessDto extends ModifyWatchlistResultDto {
    success = true;
}

export class ModifyWatchlistFailureDto extends ModifyWatchlistResultDto {
    success = false;
}

