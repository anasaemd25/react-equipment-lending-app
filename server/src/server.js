// 1. Bring in the external tools we installed
import express from "express"; // The web server toolkit
import cors from "cors"; // The security tool to allow React to talk to Express

// 2. Bring in our own data from the file we made
import { items } from "./data.js";

// 3. Create the server application and set the door (port) it listens to
const app = express();
const PORT = 3001;

// 4. Middleware (Rules that run before the request hits our routes)
app.use(cors()); // Tell the browser it is safe for port 5173 to ask us for data
app.use(express.json()); // Allow the server to understand JSON data sent in request bodies

// 5. Routes (The specific URLs our server knows how to answer)

// Route: Health Check
// Purpose: A simple ping to prove the server is alive
app.get("/api/health", (req, res) => {
    // Send back a 200 (Success) status code and a tiny JSON message
    res.status(200).json({ message: "API is running successfully" });
});

// Route: Get All Items
// Purpose: Send the entire array of equipment to the frontend
app.get("/api/items", (req, res) => {
    // Send back a 200 (Success) status code and the 'items' array from data.js
    res.status(200).json(items);
});

// Route: Get One Item by ID
// Purpose: Find a specific piece of equipment, or return a 404 error if it doesn't exist
app.get("/api/items/:id", (req, res) => {
    // Read the ID from the URL and convert it from String to Number
    const requestedId = Number(req.params.id);

    // Search through our 'items' array
    const foundItem = items.find((item) => item.id === requestedId);

    // If no item was found, send a 404 Not Found error
    if (!foundItem) {
        return res.status(404).json({ error: "Item not found" });
    }

    // If found, send the item back with a 200 success status
    res.status(200).json(foundItem);
});

// Route: Create a New Item
// Purpose: Receive new equipment data, validate it, assign an ID, and save it
app.post("/api/items", (req, res) => {
    // Pull the submitted fields out of req.body
    const { name, category, location, condition, dailyPrice, available } = req.body;

    // Data Validation: Check if mandatory fields are missing
    if (!name || !category || dailyPrice === undefined) {
        return res
            .status(400)
            .json({ error: "Validation failed: name, category, and dailyPrice are required." });
    }

    // ID Generation: Find the highest existing ID and add 1
    const newId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

    // Create the new item object
    const newItem = {
        id: newId,
        name: name,
        category: category,
        location: location || "Storage Room",
        condition: condition || "Good",
        dailyPrice: Number(dailyPrice),
        available: available !== undefined ? available : true,
    };

    // Add to array
    items.push(newItem);

    // Return 201 Created status
    res.status(201).json(newItem);
});

// Route: Update an Item by ID (PATCH)
// Purpose: Change specific fields of an existing item (like marking it unavailable or updating price)
app.patch("/api/items/:id", (req, res) => {
    // Convert URL parameter ID from String to Number
    const requestedId = Number(req.params.id);

    // Search for the target item in our array
    const itemToUpdate = items.find((item) => item.id === requestedId);

    // If the item doesn't exist, stop and return 404
    if (!itemToUpdate) {
        return res.status(404).json({ error: "Item not found" });
    }

    // Pull out any fields sent in req.body
    const { name, category, location, condition, dailyPrice, available } = req.body;

    // Only update fields if the user provided new values for them
    if (name !== undefined) itemToUpdate.name = name;
    if (category !== undefined) itemToUpdate.category = category;
    if (location !== undefined) itemToUpdate.location = location;
    if (condition !== undefined) itemToUpdate.condition = condition;
    if (dailyPrice !== undefined) itemToUpdate.dailyPrice = Number(dailyPrice);
    if (available !== undefined) itemToUpdate.available = available;

    // Send back 200 OK status code with the newly updated item
    res.status(200).json(itemToUpdate);
});

// Route: Delete an Item by ID
// Purpose: Find an item by ID and remove it completely from the array
app.delete("/api/items/:id", (req, res) => {
    // Convert URL parameter ID from String to Number
    const requestedId = Number(req.params.id);

    // Find the position (index number) of the item inside our items array
    const itemIndex = items.findIndex((item) => item.id === requestedId);

    // If findIndex returns -1, it means the item was not found
    if (itemIndex === -1) {
        return res.status(404).json({ error: "Item not found" });
    }

    // Remove 1 item from the array at that index position
    const deletedItem = items.splice(itemIndex, 1)[0];

    // Send back a 200 status code with a message confirming deletion
    res.status(200).json({ message: "Item deleted successfully", deletedItem: deletedItem });
});

// 6. Turn the server on
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
