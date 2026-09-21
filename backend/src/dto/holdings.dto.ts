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
