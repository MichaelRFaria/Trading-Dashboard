// function to get the authenticated user
import {
  FinnhubPriceChangesResponse,
  FinnhubPriceLookupRequest,
  FinnhubPriceLookupResponse,
  GainsResponse,
  StockSymbolLookupRequest,
  StockSymbolLookupResponse,
} from '@/src/types/stock';
import {
  AuthenticatedUserResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/src/types/account';
import { WatchlistRequest, WatchlistResponse } from '@/src/types/watchlist';
import {
  TradeBasicResponse,
  TradeRequest,
  TradeResponse,
} from '@/src/types/trade';
import { HistoryRequest, HistoryResponse } from '@/src/types/history';

export async function getCurrentUser(): Promise<AuthenticatedUserResponse | null> {
  return await fetchUrl('/users/me', 'GET');
}

// function to register a user
export async function registerAccount(
  data: RegisterRequest,
): Promise<RegisterResponse | null> {
  return await fetchUrl<RegisterResponse>('/users/register', 'POST', data);
}

export async function loginAccount(
  data: LoginRequest,
): Promise<LoginResponse | null> {
  return await fetchUrl<LoginResponse>('/auth/login', 'POST', data);
}

export async function logoutAccount(): Promise<boolean | null> {
  return await fetchUrl<boolean>('/auth/logout', 'POST');
}

export async function getWatchlistData(): Promise<WatchlistResponse | null> {
  return await fetchUrl<WatchlistResponse>('/watchlist/watchlist', 'GET');
}

export async function addToWatchlist(
  data: WatchlistRequest,
): Promise<WatchlistResponse | null> {
  return await fetchUrl<WatchlistResponse>('/watchlist/add', 'POST', data);
}

export async function deleteFromWatchlist(
  data: WatchlistRequest,
): Promise<WatchlistResponse | null> {
  return await fetchUrl<WatchlistResponse>('/watchlist/delete', 'DELETE', data);
}

export async function getHoldingsData(): Promise<TradeResponse | null> {
  return await fetchUrl<TradeResponse>('/holdings/holdings', 'GET');
}

export async function buyHolding(
  data: TradeRequest,
): Promise<TradeBasicResponse | null> {
  return await fetchUrl<TradeBasicResponse>('/trade/buy', 'POST', data);
}

export async function sellHolding(
  data: TradeRequest,
): Promise<TradeBasicResponse | null> {
  return await fetchUrl<TradeBasicResponse>('/trade/sell', 'POST', data);
}

export async function getHistory(
  data: HistoryRequest,
): Promise<HistoryResponse | null> {
  const params = new URLSearchParams();

  // all properties are optional so check if each property is not undefined
  if (data.stock_symbol !== undefined) {
    params.set('stock_symbol', data.stock_symbol);
  }

  if (data.quantity_from !== undefined) {
    params.set('quantity_from', data.quantity_from.toString());
  }

  if (data.quantity_to !== undefined) {
    params.set('quantity_to', data.quantity_to.toString());
  }

  if (data.price_from !== undefined) {
    params.set('price_from', data.price_from.toString());
  }

  if (data.price_to !== undefined) {
    params.set('price_to', data.price_to.toString());
  }

  if (data.type !== undefined) {
    params.set('type', data.type);
  }

  if (data.date_from !== undefined) {
    params.set('date_from', data.date_from);
  }

  if (data.date_to !== undefined) {
    params.set('date_to', data.date_to);
  }

  return await fetchUrl<HistoryResponse>(
    `/trade/history?${params.toString()}`,
    'GET',
  );
}

export async function getGains(): Promise<GainsResponse | null> {
  return await fetchUrl<GainsResponse>('/trade/gains', 'GET');
}

export async function getPriceChanges(): Promise<FinnhubPriceChangesResponse | null> {
  return await fetchUrl<FinnhubPriceChangesResponse>(
    '/holdings/price-changes',
    'GET',
  );
}

export async function finnhubStockSymbolLookup(
  data: StockSymbolLookupRequest,
): Promise<StockSymbolLookupResponse | null> {
  const params = new URLSearchParams({
    stock_symbol: data.stock_symbol,
  });

  return await fetchUrl<StockSymbolLookupResponse>(
    `/finnhub/symbol-lookup?${params.toString()}`,
    'GET',
  );
}

export async function finnhubPriceQuote(
  data: FinnhubPriceLookupRequest,
): Promise<FinnhubPriceLookupResponse | null> {
  const params = new URLSearchParams({
    stock_symbol: data.stock_symbol,
    type: data.type,
  });

  return await fetchUrl<FinnhubPriceLookupResponse>(
    `/finnhub/price?${params.toString()}`,
    'GET',
    data,
  );
}

// helper function to make HTTP calls
async function fetchUrl<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: unknown,
): Promise<T | null> {
  const url = 'http://localhost:3001' + path;

  const options: RequestInit = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // allows cookies
    cache: 'no-store',
  };

  // if the method is not a GET request and there is data, stringify the data and add it to the options
  if (method !== 'GET' && data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    return null;
  }
}
