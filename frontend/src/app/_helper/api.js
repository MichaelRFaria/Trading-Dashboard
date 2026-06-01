// function to register a user
export async function registerAccount(data) {
    return await fetchUrl("/api/users/register", "POST", data);
}

// helper function to make HTTP calls
async function fetchUrl(url, method = "GET", data) {
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