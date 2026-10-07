// Base URL pointing to our Express server port
const API_BASE_URL = "http://localhost:3001/api";

// Helper function: Sends fetch requests and checks if the response was successful
async function handleResponse(response) {
    // Check if HTTP status code is between 200 and 299
    if (!response.ok) {
        // Try to extract the error message sent back by Express
        const errorData = await response.json().catch(() => ({}));
        // Throw an error with the server message or a fallback message
        throw new Error(errorData.error || `Server request failed with status: ${response.status}`);
    }
    // Return the parsed JSON body data
    return response.json();
}

// 1. GET ALL ITEMS: Fetches array of all equipment items
export async function fetchItems() {
    const response = await fetch(`${API_BASE_URL}/items`);
    return handleResponse(response);
}

// 2. GET ONE ITEM: Fetches a single equipment item by its numeric ID
export async function fetchItemById(id) {
    const response = await fetch(`${API_BASE_URL}/items/${id}`);
    return handleResponse(response);
}

// 3. CREATE ITEM: Sends POST request to create a new equipment item
export async function createItem(itemData) {
    const response = await fetch(`${API_BASE_URL}/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Tells Express to parse body as JSON
        },
        body: JSON.stringify(itemData), // Converts JS object into JSON text string
    });
    return handleResponse(response);
}

// 4. UPDATE ITEM: Sends PATCH request to update specific fields of an item
export async function updateItem(id, itemData) {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
    });
    return handleResponse(response);
}

// 5. DELETE ITEM: Sends DELETE request to remove an item by its ID
export async function deleteItem(id) {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: "DELETE",
    });
    return handleResponse(response);
}
