export type WatchlistRequest = {
  stock_symbol: string;
};

export type WatchlistResponse = WatchlistFailureResponse | WatchlistData;

export type WatchlistFailureResponse = {
  message: string;
};

export type WatchlistData = {
  data: WatchlistDataItem[];
};

export type WatchlistDataItem = {
  id: number;
  stock_symbol: string;
  user_id: number;
};
