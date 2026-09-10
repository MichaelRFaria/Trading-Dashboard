export type HistoryRequest = {
    stock_symbol?: string,
    quantity_from?: number,
    quantity_to?: number,
    price_from?: number,
    price_to?: number,
    type?: "buy" | "sell",
    date_from?: string,
    date_to?: string,
}

/*
* date here is string as its serialised as an ISO string due to the JSON request,
* to be created by frontend like: const date = new Date().toISOString();
* to be parsed by backend like: const dateFrom = new Date(dto.date_from);
* */

export type HistoryDataItem = {
    id: number;
    user_id: number;
    stock_symbol: string;
    quantity: number;
    price: number;
    type: "buy" | "sell";
    createdAt: string;
};

export type HistoryResponse = HistoryDataItem[];