import express from "express";
import cors from "cors";

// 1. Create the Express application
const app = express(); // Creates th server application
const PORT = 3001;

// 2. Middleware
app.use(cors()); // Allows the React frontend to talk to this API
app.use(express.json()); // Allows Express to read JSON data sent in request bodies

// 3. Routes
app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "API is running successfully" });
});

// 4. Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
