export class FinnhubSymbolLookupDto {
    stock_symbol: string;
}

export class FinnhubPriceLookupDto {
    stock_symbol: string;
    type: "current" | "change";
}

export class FinnhubPriceChangeDto {
    data: FinnhubPriceChangeDataItemDto[]
}

export class FinnhubPriceChangeDataItemDto {
    stock_symbol: string;
    price_change: number;
}