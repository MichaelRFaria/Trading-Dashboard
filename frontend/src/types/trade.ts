export type TradeRequest = {
    stock_symbol: string,
    quantity: number,
}

export type TradeResponse = TradeBasicResponse | HoldingsData

export type TradeBasicResponse = {
    success: boolean,
    message: string,
}

export type HoldingsData = {
    data: HoldingsDataItem[]
}

export type HoldingsDataItem = {
    id: number,
    stock_symbol: string,
    quantity: number,
    user_id: number
}