// 1. Import React tools:
// 'useState' creates smart variables that update the screen when changed.
// 'useEffect' runs code automatically at specific times (like when the page first loads).
import { useState, useEffect } from "react";

// Main App component function
function App() {
    // --- React State Variables (Our Smart Whiteboards) ---

    // Holds the list of equipment items fetched from the Express backend (starts as an empty array [])
    const [items, setItems] = useState([]);

    // Tracks if the page is currently downloading data from the backend (starts as true)
    const [loading, setLoading] = useState(true);

    // Holds any error message if the backend server crashes or fails to respond (starts as null)
    const [error, setError] = useState(null);

    // Form Field State: Holds whatever text the user types into the 'Equipment Name' input box
    const [name, setName] = useState("");

    // Form Field State: Holds whatever text the user types into the 'Category' input box
    const [category, setCategory] = useState("");

    // Form Field State: Holds whatever number the user types into the 'Daily Price' input box
    const [dailyPrice, setDailyPrice] = useState("");

    // Form Field State: Holds whatever text the user types into the 'Storage Location' input box
    const [location, setLocation] = useState("");

    // --- 1. GET ALL ITEMS (GET Request) ---
    // Runs automatically ONCE when the app first opens in the browser.
    useEffect(() => {
        // Send a GET request across port 5173 over to Express on port 3001
        fetch("http://localhost:3001/api/items")
            .then((response) => {
                // Check if Express responded with a 200 OK status code
                if (!response.ok) {
                    // If status is 404 or 500, jump down to the .catch() error handler
                    throw new Error("Failed to fetch equipment data from server");
                }
                // Unpack raw network text data into usable JavaScript objects
                return response.json();
            })
            .then((data) => {
                // Save the downloaded list into our 'items' smart whiteboard state
                setItems(data);
                // Turn off the loading message because data has arrived successfully
                setLoading(false);
            })
            .catch((err) => {
                // Save the error message text so we can show it to the user
                setError(err.message);
                // Turn off the loading message so the error message shows up
                setLoading(false);
            });
    }, []); // The empty [] dependency array means: "Run this effect ONLY ONCE on page startup"

    // --- 2. ADD NEW EQUIPMENT (POST Request) ---
    // Runs whenever the user submits the "Add Equipment" form
    const handleAddItem = (event) => {
        // Prevent default browser form submission (which would reload the whole page)
        event.preventDefault();

        // Create a JavaScript object with the data typed into the form text boxes
        const newItemData = {
            name: name, // Value from the name input box state
            category: category, // Value from the category input box state
            dailyPrice: Number(dailyPrice), // Convert string input value to a real Number
            location: location || "Storage Room", // Use typed location or default fallback text
            available: true, // New equipment starts as available by default
        };

        // Send a POST request to Express on port 3001
        fetch("http://localhost:3001/api/items", {
            method: "POST", // HTTP method for creating new data
            headers: {
                "Content-Type": "application/json", // Tells Express to parse the incoming body as JSON
            },
            body: JSON.stringify(newItemData), // Convert JavaScript object into JSON text string
        })
            .then((response) => {
                // Check if Express responded with a 201 Created status code
                if (!response.ok) {
                    throw new Error("Failed to add new item. Check required fields.");
                }
                // Read the created item object returned by Express (which now includes its new ID)
                return response.json();
            })
            .then((createdItem) => {
                // Update state using spread operator (...items):
                // Copy all existing items and attach the newly created item at the end of the array
                setItems([...items, createdItem]);

                // Clear out all input text boxes so the form is clean again
                setName("");
                setCategory("");
                setDailyPrice("");
                setLocation("");
            })
            .catch((err) => {
                // Show an alert popup box if the creation request fails
                alert(`Error: ${err.message}`);
            });
    };

    // --- 3. BORROW / RETURN TOGGLE (PATCH Request) ---
    // Runs when the user clicks the "Borrow Equipment" or "Return Equipment" button on an item
    const handleToggleAvailable = (id, currentAvailableStatus) => {
        // Send a PATCH request to Express for the specific item ID
        fetch(`http://localhost:3001/api/items/${id}`, {
            method: "PATCH", // HTTP method for updating specific fields of existing data
            headers: {
                "Content-Type": "application/json", // Tells Express this is JSON data
            },
            body: JSON.stringify({ available: !currentAvailableStatus }), // Flip boolean (true becomes false, false becomes true)
        })
            .then((response) => {
                // Check if Express responded with a 200 OK status code
                if (!response.ok) {
                    throw new Error("Failed to update availability status.");
                }
                // Read the newly updated item object returned by Express
                return response.json();
            })
            .then((updatedItem) => {
                // Selective state update using .map():
                // Loop through every item in state. If item.id matches target id, swap it for updatedItem.
                // If IDs do not match, leave the item untouched.
                setItems(items.map((item) => (item.id === id ? updatedItem : item)));
            })
            .catch((err) => {
                // Show an alert popup box if the patch request fails
                alert(`Error: ${err.message}`);
            });
    };

    // --- CONDITIONAL SCREENS ---

    // 1. Show loading screen while waiting for the initial GET fetch request to finish
    if (loading) return <h2>Loading equipment list...</h2>;

    // 2. Show red error message screen if the initial fetch request failed
    if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;

    // --- MAIN APP UI RENDER ---
    return (
        // Outer container wrapper centered on screen with maximum width
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "left" }}>
            {/* Main App Heading */}
            <h1 style={{ marginBottom: "20px", fontSize: "28px", color: "#111" }}>
                Equipment Lending Service
            </h1>

            {/* --- ADD ITEM FORM SECTION --- */}
            <section
                style={{
                    background: "#ffffff",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    marginBottom: "30px",
                }}
            >
                <h2 style={{ marginBottom: "15px", fontSize: "20px" }}>Add New Equipment</h2>

                {/* Form element: Triggers handleAddItem when submit button is clicked */}
                <form onSubmit={handleAddItem}>
                    {/* Equipment Name Input Field */}
                    <div style={{ marginBottom: "12px" }}>
                        <label
                            style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}
                        >
                            Equipment Name *
                        </label>
                        <input
                            type="text" // Input type is plain text
                            value={name} // Value is controlled by the 'name' state variable
                            onChange={(e) => setName(e.target.value)} // Update state on every keystroke
                            placeholder="e.g. Sony Wireless Mic" // Grey placeholder text inside empty input
                            required // Browser requires this field before allowing form submission
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </div>

                    {/* Category Input Field */}
                    <div style={{ marginBottom: "12px" }}>
                        <label
                            style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}
                        >
                            Category *
                        </label>
                        <input
                            type="text" // Input type is plain text
                            value={category} // Value is controlled by the 'category' state variable
                            onChange={(e) => setCategory(e.target.value)} // Update state on every keystroke
                            placeholder="e.g. Audio" // Grey placeholder text
                            required // Browser requires this field before allowing form submission
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </div>

                    {/* Daily Price Input Field */}
                    <div style={{ marginBottom: "12px" }}>
                        <label
                            style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}
                        >
                            Daily Price (€) *
                        </label>
                        <input
                            type="number" // Input type is number only
                            value={dailyPrice} // Value is controlled by the 'dailyPrice' state variable
                            onChange={(e) => setDailyPrice(e.target.value)} // Update state on every keystroke
                            placeholder="e.g. 15" // Grey placeholder text
                            required // Browser requires this field before allowing form submission
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </div>

                    {/* Storage Location Input Field */}
                    <div style={{ marginBottom: "16px" }}>
                        <label
                            style={{ fontWeight: "bold", display: "block", marginBottom: "4px" }}
                        >
                            Storage Location
                        </label>
                        <input
                            type="text" // Input type is plain text
                            value={location} // Value is controlled by the 'location' state variable
                            onChange={(e) => setLocation(e.target.value)} // Update state on every keystroke
                            placeholder="e.g. Locker A1" // Grey placeholder text
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                            }}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit" // Triggers form onSubmit event when clicked
                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        + Add Equipment
                    </button>
                </form>
            </section>

            {/* --- EQUIPMENT LIST SECTION --- */}
            {/* Shows the total count of items dynamically using items.length */}
            <h2 style={{ marginBottom: "15px", fontSize: "22px" }}>
                Available Equipment ({items.length})
            </h2>

            {/* Unordered List: Clears default bullet points using listStyle: 'none' */}
            <ul style={{ listStyle: "none", padding: 0 }}>
                {/* Loop through the items array and map each item object into an HTML list card */}
                {items.map((item) => (
                    <li
                        key={item.id} // Unique key required by React to efficiently track list elements
                        style={{
                            background: "#ffffff",
                            marginBottom: "12px",
                            padding: "16px",
                            borderRadius: "6px",
                            border: "1px solid #e0e0e0",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        }}
                    >
                        {/* Display Item Name and Category */}
                        <div style={{ fontSize: "18px", fontWeight: "bold", color: "#222" }}>
                            {item.name}{" "}
                            <span style={{ fontSize: "14px", color: "#666", fontWeight: "normal" }}>
                                ({item.category})
                            </span>
                        </div>

                        {/* Display Storage Location and Daily Price */}
                        <div style={{ marginTop: "6px", color: "#555" }}>
                            Location: <strong>{item.location}</strong> | Price:{" "}
                            <strong>€{item.dailyPrice}/day</strong>
                        </div>

                        {/* Display Current Availability Status with dynamic green/red color */}
                        <div style={{ marginTop: "6px" }}>
                            Status:{" "}
                            <span
                                style={{
                                    color: item.available ? "green" : "red",
                                    fontWeight: "bold",
                                }}
                            >
                                {item.available ? "Available" : "Borrowed"}
                            </span>
                        </div>

                        {/* --- BORROW / RETURN BUTTON --- */}
                        {/* Button calls handleToggleAvailable with item ID and current available status when clicked */}
                        <button
                            onClick={() => handleToggleAvailable(item.id, item.available)}
                            style={{
                                marginTop: "12px",
                                padding: "8px 14px",
                                // Green background if available, yellow background if borrowed
                                backgroundColor: item.available ? "#28a745" : "#ffc107",
                                // White text if available, black text if borrowed
                                color: item.available ? "white" : "black",
                                border: "none",
                                borderRadius: "4px",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            {/* Button text dynamically changes based on item.available status */}
                            {item.available ? "Borrow Equipment" : "Return Equipment"}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Export the App component so index.html / main.jsx can import and render it
export default App;
