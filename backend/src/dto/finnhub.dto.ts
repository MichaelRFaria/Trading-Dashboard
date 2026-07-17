export class FinnhubSymbolLookupDto {
    stock_symbol: string;
}

export class StockSymbolLookupResultDto {
    description: string;
    stock_symbol: string;
    type: string;
}

export class FinnhubPriceLookupDto {
    stock_symbol: string;
    type: "current" | "change";
}

export class FinnhubPriceLookupResultDto {
    price: number
}

export class FinnhubPriceChangeDto {
    data: FinnhubPriceChangeDataItemDto[]
}

export class FinnhubPriceChangeDataItemDto {
    stock_symbol: string;
    price_change: number;
}