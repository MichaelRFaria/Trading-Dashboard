// function to get the authenticated user
export async function getCurrentUser() {
    return await fetchUrl("/users/me", "GET")
}

// function to register a user
export async function registerAccount(data) {
    return await fetchUrl("/users/register", "POST", data);
}

export async function loginAccount(data) {
    return await fetchUrl("/auth/login", "POST", data);
}

export async function getWatchlistData() {
    return await fetchUrl("/watchlist/watchlist", "GET")
}

export async function addToWatchlist(data) {
    return await fetchUrl("/watchlist/add", "POST", data);
}

export async function deleteFromWatchlist(data) {
    return await fetchUrl("/watchlist/delete", "DELETE", data);
}

export async function getHoldingsData() {
    return await fetchUrl("/holdings/holdings", "GET")
}

export async function buyHolding(data) {
    return await fetchUrl("/trade/buy", "POST", data);
}

export async function sellHolding(data) {
    return await fetchUrl("/trade/sell", "POST", data);
}

export async function getGains() {
    return await fetchUrl("/trade/gains","GET")
}

export async function finnhubStockSymbolLookup(data) {
    const params = new URLSearchParams({
        stock_symbol: data.stock_symbol,
    });

    return await fetchUrl(`/finnhub/symbol-lookup?${params.toString()}`, "GET", data);
}

export async function finnhubPriceQuote(data) {
    const params = new URLSearchParams({
        stock_symbol: data.stock_symbol,
    });

    return await fetchUrl(`/finnhub/price?${params.toString()}`, "GET", data);
}

// helper function to make HTTP calls
async function fetchUrl(path, method = "GET", data = null) {
    const url = "http://localhost:3001" + path

    const options = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include" // allows cookies
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

        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
}