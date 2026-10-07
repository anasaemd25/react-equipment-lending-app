// 1. Bring in external tools:
// 'express' is our web server framework.
// 'cors' allows our React frontend on port 5173 to talk to Express on port 3001.
import express from "express";
import cors from "cors";

// 2. Import our in-memory items array from data.js
import { items } from "./data.js";

// 3. Initialize the Express application and specify port 3001
const app = express();
const PORT = 3001;

// 4. MIDDLEWARE SETUP:
// Allows cross-origin network requests from our Vite React frontend
app.use(cors());

// Parses incoming JSON text strings in request bodies into JavaScript objects attached to req.body
app.use(express.json());

// Allowed keys for data validation
const ALLOWED_FIELDS = ["name", "category", "location", "condition", "dailyPrice", "available"];

// Helper function: Helper to convert URL parameters to numbers and validate them
function parseAndValidateId(idParam) {
    const numericId = Number(idParam);
    // Requirement 6.1: return null if parameter is not a finite positive integer
    if (isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
        return null;
    }
    return numericId;
}

// --- 5. ROUTE DEFINITIONS ---

// Route 1: Health Check
// Purpose: Proves to the frontend/teacher that the backend server is alive
app.get("/api/health", (req, res) => {
    // Returns HTTP 200 OK status with a simple JSON message
    res.status(200).json({
        status: "ok",
        message: "Equipment Lending API is running successfully",
    });
});

// Route 2: Get All Items
// Purpose: Returns the full array of equipment items
app.get("/api/items", (req, res) => {
    // Returns HTTP 200 OK status with the items array
    res.status(200).json(items);
});

// Route 3: Get One Item by ID
// Purpose: Find a specific piece of equipment by its numeric ID parameter
app.get("/api/items/:id", (req, res) => {
    // Requirement 6: Treat route parameter as text until converted and validated
    const requestedId = parseAndValidateId(req.params.id);

    // Requirement 6.1: Return 400 Bad Request if ID is invalid (e.g. /api/items/abc)
    if (requestedId === null) {
        return res
            .status(400)
            .json({ error: "Invalid ID parameter. ID must be a positive integer." });
    }

    // Search through array for matching item ID
    const foundItem = items.find((item) => item.id === requestedId);

    // Requirement 6.1: Return 404 Not Found if valid ID doesn't match any item
    if (!foundItem) {
        return res
            .status(404)
            .json({ error: `Equipment item with ID ${requestedId} was not found.` });
    }

    // Return HTTP 200 OK status with the single item object
    res.status(200).json(foundItem);
});

// Route 4: Create New Item (POST)
// Purpose: Receive new equipment details, validate input contract, generate ID, and save
app.post("/api/items", (req, res) => {
    const { name, category, location, condition, dailyPrice, available } = req.body;

    // Requirement 6.1 Validation Contract for POST:
    // Require non-blank name, category, location, condition, finite dailyPrice >= 0, boolean available
    if (
        !name ||
        typeof name !== "string" ||
        name.trim() === "" ||
        !category ||
        typeof category !== "string" ||
        category.trim() === "" ||
        !location ||
        typeof location !== "string" ||
        location.trim() === "" ||
        !condition ||
        typeof condition !== "string" ||
        condition.trim() === "" ||
        dailyPrice === undefined ||
        typeof dailyPrice !== "number" ||
        isNaN(dailyPrice) ||
        dailyPrice < 0 ||
        typeof available !== "boolean"
    ) {
        return res.status(400).json({
            error: "Validation failed: non-blank name, category, location, condition, price >= 0, and boolean available are required.",
        });
    }

    // Generate positive numeric ID (Find max ID and add 1, or start at 1 if list is empty)
    const newId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

    // Build complete created item object
    const newItem = {
        id: newId,
        name: name.trim(),
        category: category.trim(),
        location: location.trim(),
        condition: condition.trim(),
        dailyPrice: Number(dailyPrice),
        available: available,
    };

    // Append new item to our in-memory array
    items.push(newItem);

    // Return HTTP 201 Created status code with newly created item object
    res.status(201).json(newItem);
});

// Route 5: Update Item by ID (PATCH)
// Purpose: Partially update supported editable fields for an existing item
app.patch("/api/items/:id", (req, res) => {
    // Validate ID parameter
    const requestedId = parseAndValidateId(req.params.id);
    if (requestedId === null) {
        return res
            .status(400)
            .json({ error: "Invalid ID parameter. ID must be a positive integer." });
    }

    // Locate target item in array
    const itemToUpdate = items.find((item) => item.id === requestedId);
    if (!itemToUpdate) {
        return res
            .status(404)
            .json({ error: `Equipment item with ID ${requestedId} was not found.` });
    }

    // Extract body fields
    const updates = req.body;

    // Requirement 6.1: Reject request if empty body or contains unknown fields
    const updateKeys = Object.keys(updates);
    if (updateKeys.length === 0) {
        return res.status(400).json({ error: "Validation failed: request body cannot be empty." });
    }

    const hasInvalidKey = updateKeys.some((key) => !ALLOWED_FIELDS.includes(key));
    if (hasInvalidKey) {
        return res
            .status(400)
            .json({
                error: "Validation failed: request body contains unknown or uneditable fields.",
            });
    }

    // Validate supplied field values before modifying data
    if (
        updates.name !== undefined &&
        (typeof updates.name !== "string" || updates.name.trim() === "")
    ) {
        return res
            .status(400)
            .json({ error: "Validation failed: name must be a non-blank string." });
    }
    if (
        updates.dailyPrice !== undefined &&
        (typeof updates.dailyPrice !== "number" ||
            isNaN(updates.dailyPrice) ||
            updates.dailyPrice < 0)
    ) {
        return res
            .status(400)
            .json({ error: "Validation failed: dailyPrice must be a finite number >= 0." });
    }
    if (updates.available !== undefined && typeof updates.available !== "boolean") {
        return res.status(400).json({ error: "Validation failed: available must be a boolean." });
    }

    // Apply validated updates to item in memory
    if (updates.name !== undefined) itemToUpdate.name = updates.name.trim();
    if (updates.category !== undefined) itemToUpdate.category = updates.category.trim();
    if (updates.location !== undefined) itemToUpdate.location = updates.location.trim();
    if (updates.condition !== undefined) itemToUpdate.condition = updates.condition.trim();
    if (updates.dailyPrice !== undefined) itemToUpdate.dailyPrice = Number(updates.dailyPrice);
    if (updates.available !== undefined) itemToUpdate.available = updates.available;

    // Return HTTP 200 OK status code with complete updated item object
    res.status(200).json(itemToUpdate);
});

// Route 6: Delete Item by ID (DELETE)
// Purpose: Remove an item from the memory array by its ID
app.delete("/api/items/:id", (req, res) => {
    // Validate ID parameter
    const requestedId = parseAndValidateId(req.params.id);
    if (requestedId === null) {
        return res
            .status(400)
            .json({ error: "Invalid ID parameter. ID must be a positive integer." });
    }

    // Find index position of target item in array
    const itemIndex = items.findIndex((item) => item.id === requestedId);
    if (itemIndex === -1) {
        return res
            .status(404)
            .json({ error: `Equipment item with ID ${requestedId} was not found.` });
    }

    // Cut out item from array using splice
    const deletedItem = items.splice(itemIndex, 1)[0];

    // Return HTTP 200 OK status code with removed item object
    res.status(200).json({ message: "Item deleted successfully", deletedItem: deletedItem });
});

// --- 6. ERROR HANDLERS (Section 6 requirements) ---

// Requirement 6: Unmatched endpoint handler for unknown API routes (returns 404 Not Found)
app.use((req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.url} - Endpoint does not exist.` });
});

// Requirement 6: Unexpected server error handler middleware (returns 500 Internal Server Error)
app.use((err, req, res, next) => {
    console.error("Unexpected Server Error:", err.stack);
    res.status(500).json({ error: "Internal server error occurred." });
});

// --- 7. START SERVER ---
app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
});
