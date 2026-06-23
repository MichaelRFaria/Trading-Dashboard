export type TradeHolding = BuyHoldingDto | SellHoldingDto

export class BuyHoldingDto {
    stock_symbol: string;
    quantity: number;
}

export class SellHoldingDto {
    stock_symbol: string;
    quantity: number;
}