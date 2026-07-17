export class HoldingsFetchFailureDto {
    success = false;
    message: string;
}

export class HoldingsFetchSuccessDto {
    data: HoldingsDataItem[];
}

export class HoldingsDataItem {
    id: number;
    stock_symbol: string;
    user_id: number;
}

export type TradeHolding = BuyHoldingDto | SellHoldingDto

export class BuyHoldingDto {
    stock_symbol: string;
    quantity: number;
}

export class SellHoldingDto {
    stock_symbol: string;
    quantity: number;
}

export class TradeHoldingResultDto {
    success: boolean;
    message: string;
}

export class BuyHoldingResultDto extends TradeHoldingResultDto {
}

export class SellHoldingResultDto extends TradeHoldingResultDto {
}

export class GainsDto {
    realised_gains: number
    unrealised_gains: number;
}