export type StockSymbolLookupRequest = {
    stock_symbol: string,
}

export type StockSymbolLookupResponse = {
    count: number,
    result: StockSymbolLookupResponseResult[],
}

export type StockSymbolLookupResponseResult = {
    description: string,
    displaySymbol: string,
    symbol: string,
    type: string,
}