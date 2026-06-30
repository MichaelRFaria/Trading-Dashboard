export type TradeHolding = BuyHoldingDto | SellHoldingDto

export class BuyHoldingDto {
    stock_symbol: string;
    quantity: number;
}

export class SellHoldingDto {
    stock_symbol: string;
    quantity: number;
}

export class GainsDto {
    realised_gains: number
    unrealised_gains: number;
}