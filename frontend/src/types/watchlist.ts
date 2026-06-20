export type WatchlistRequest = {
    stock_symbol: string,
}

export type WatchlistResponse = WatchlistBasicResponse | WatchlistData


export type WatchlistBasicResponse = {
    success: boolean,
    message: string,
}

export type WatchlistData = {
    data: WatchlistDataItem[]
}

export type WatchlistDataItem = {
    id: number,
    stock_symbol: string,
    user_id: number
}