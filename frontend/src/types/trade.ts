export type TradeRequest = {
    stock_symbol: string,
    quantity: number,
}

export type TradeResponse = {
    success: boolean,
    message: string,
}