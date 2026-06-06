// function to register a user
export async function registerAccount(data) {
    return await fetchUrl("/users/register", "POST", data);
}

export async function loginAccount(data) {
    return await fetchUrl("/users/login", "POST", data);
}

export async function addToWatchlist(data) {
    return await fetchUrl("/watchlist/add", "POST", data);
}

export async function deleteFromWatchlist(data) {
    return await fetchUrl("/watchlist/delete", "DELETE", data);
}

// helper function to make HTTP calls
async function fetchUrl(path, method = "GET", data) {
    const url = "http://localhost:3001" + path
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error(`Response status: ${response.status}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
}