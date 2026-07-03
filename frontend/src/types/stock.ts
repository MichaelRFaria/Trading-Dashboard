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

export type HoldingsPrice = Record<string, number>

export type HoldingValue = {
    stock_symbol: string,
    value: number
}

export type GainsResponse = {
    realised_gains: number,
    unrealised_gains: number
}