// function to get the authenticated user
import {
    FinnhubPriceChangesResponse,
    FinnhubPriceLookupRequest, FinnhubPriceLookupResponse,
    GainsResponse,
    StockSymbolLookupRequest,
    StockSymbolLookupResponse
} from "@/src/types/stock";
import {AuthenticatedUser, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse} from "@/src/types/account";
import {WatchlistBasicResponse, WatchlistRequest, WatchlistResponse} from "@/src/types/watchlist";
import {TradeBasicResponse, TradeRequest, TradeResponse} from "@/src/types/trade";

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
    return await fetchUrl("/users/me", "GET")
}

// function to register a user
export async function registerAccount(data: RegisterRequest): Promise<RegisterResponse | null> {
    return await fetchUrl<RegisterResponse>("/users/register", "POST", data);
}

export async function loginAccount(data: LoginRequest): Promise<LoginResponse | null> {
    return await fetchUrl<LoginResponse>("/auth/login", "POST", data);
}

export async function getWatchlistData(): Promise<WatchlistResponse | null> {
    return await fetchUrl<WatchlistResponse>("/watchlist/watchlist", "GET")
}

export async function addToWatchlist(data: WatchlistRequest): Promise<WatchlistBasicResponse | null> {
    return await fetchUrl<WatchlistBasicResponse>("/watchlist/add", "POST", data);
}

export async function deleteFromWatchlist(data: WatchlistRequest): Promise<WatchlistBasicResponse | null> {
    return await fetchUrl<WatchlistBasicResponse>("/watchlist/delete", "DELETE", data);
}

export async function getHoldingsData(): Promise<TradeResponse | null> {
    return await fetchUrl<TradeResponse>("/holdings/holdings", "GET")
}

export async function buyHolding(data: TradeRequest): Promise<TradeBasicResponse | null> {
    return await fetchUrl<TradeBasicResponse>("/trade/buy", "POST", data);
}

export async function sellHolding(data: TradeRequest): Promise<TradeBasicResponse | null> {
    return await fetchUrl<TradeBasicResponse>("/trade/sell", "POST", data);
}

export async function getGains(): Promise<GainsResponse | null> {
    return await fetchUrl<GainsResponse>("/trade/gains", "GET")
}

export async function getPriceChanges(): Promise<FinnhubPriceChangesResponse | null> {
    return await fetchUrl<FinnhubPriceChangesResponse>("/holdings/price-changes", "GET")
}

export async function finnhubStockSymbolLookup(data: StockSymbolLookupRequest): Promise<StockSymbolLookupResponse | null> {
    const params = new URLSearchParams({
        stock_symbol: data.stock_symbol,
    });

    return await fetchUrl<StockSymbolLookupResponse>(`/finnhub/symbol-lookup?${params.toString()}`, "GET", data);
}

export async function finnhubPriceQuote(data: FinnhubPriceLookupRequest): Promise<FinnhubPriceLookupResponse | null> {
    const params = new URLSearchParams({
        stock_symbol: data.stock_symbol,
        type: data.type
    });

    return await fetchUrl<FinnhubPriceLookupResponse>(`/finnhub/price?${params.toString()}`, "GET", data);
}

// helper function to make HTTP calls
async function fetchUrl<T>(path: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET", data?: unknown): Promise<T | null> {
    const url = "http://localhost:3001" + path

    const options: RequestInit = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include", // allows cookies
        cache: "no-store",
    }

    // if the method is not a GET request and there is data, stringify the data and add it to the options
    if (method !== "GET" && data) {
        options.body = JSON.stringify(data)
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            console.error(`Response status: ${response.status}`);
            return null;
        }

        return await response.json() as T;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error)
        }

        return null;
    }
}