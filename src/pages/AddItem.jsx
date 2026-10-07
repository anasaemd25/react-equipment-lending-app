// 1. Import React tools and React Router navigation hook
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 2. Import createItem network API function from central src/api.js module
import { createItem } from "../api";

function AddItem() {
    // 'useNavigate' provides a function to redirect the user programmatically after saving
    const navigate = useNavigate();

    // --- CONTROLLED FORM STATE VARIABLES (Smart Whiteboards) ---
    // Holds equipment name typed by user
    const [name, setName] = useState("");

    // Holds category typed by user
    const [category, setCategory] = useState("");

    // Holds daily price typed by user
    const [dailyPrice, setDailyPrice] = useState("");

    // Holds storage location typed by user
    const [location, setLocation] = useState("");

    // Holds condition selected by user in dropdown (defaults to 'Good')
    const [condition, setCondition] = useState("Good");

    // --- SUBMIT HANDLER (POST REQUEST) ---
    const handleSubmit = (e) => {
        // Prevent default browser form behavior (reloading the whole page)
        e.preventDefault();

        // Construct the item object to send to Express
        const newItem = {
            name: name,
            category: category,
            dailyPrice: Number(dailyPrice), // Convert string input value to Number
            location: location || "Storage Room", // Fallback default if field left blank
            condition: condition,
            available: true, // New items start as available by default
        };

        // Call centralized createItem API function from src/api.js
        createItem(newItem)
            .then(() => {
                // Section 7 Requirement: On successful POST, redirect back to /items list view
                navigate("/items");
            })
            .catch((err) => {
                // Section 7 Requirement: On unsuccessful POST, keep user form input and show error
                alert(`Failed to create item: ${err.message}`);
            });
    };

    return (
        <div>
            <h2>Add New Equipment</h2>

            {/* Form element: Triggers handleSubmit when button is clicked */}
            <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
                {/* Name Input */}
                <div style={{ marginBottom: "12px" }}>
                    <label style={{ fontWeight: "bold", display: "block" }}>Equipment Name *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sony Wireless Mic"
                        required // Browser-level validation for mandatory field
                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                    />
                </div>

                {/* Category Input */}
                <div style={{ marginBottom: "12px" }}>
                    <label style={{ fontWeight: "bold", display: "block" }}>Category *</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Audio"
                        required // Browser-level validation for mandatory field
                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                    />
                </div>

                {/* Daily Price Input */}
                <div style={{ marginBottom: "12px" }}>
                    <label style={{ fontWeight: "bold", display: "block" }}>
                        Daily Price (€) *
                    </label>
                    <input
                        type="number"
                        value={dailyPrice}
                        onChange={(e) => setDailyPrice(e.target.value)}
                        placeholder="e.g. 15"
                        required // Browser-level validation for mandatory field
                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                    />
                </div>

                {/* Storage Location Input */}
                <div style={{ marginBottom: "12px" }}>
                    <label style={{ fontWeight: "bold", display: "block" }}>Storage Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Studio A"
                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                    />
                </div>

                {/* Condition Dropdown Select */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ fontWeight: "bold", display: "block" }}>Condition</label>
                    <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                    >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                    </select>
                </div>

                {/* Save Button */}
                <button
                    type="submit"
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                >
                    Save Equipment
                </button>
            </form>
        </div>
    );
}

// Export AddItem component
export default AddItem;
