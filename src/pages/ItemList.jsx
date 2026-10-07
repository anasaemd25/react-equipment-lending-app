// 1. Import React tools and React Router's Link tag
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// 2. Import network API functions from our central api.js module
import { fetchItems, updateItem, deleteItem } from "../api";

function ItemList() {
    // State variables for items list, loading screen, and error messages
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State variables for search input box and category dropdown filter
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Load equipment list on first load
    useEffect(() => {
        fetchItems()
            .then((data) => {
                setItems(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Toggle Borrow / Return status (PATCH)
    const handleToggleAvailable = (id, currentStatus) => {
        updateItem(id, { available: !currentStatus })
            .then((updatedItem) => {
                setItems(items.map((item) => (item.id === id ? updatedItem : item)));
            })
            .catch((err) => alert(`Error: ${err.message}`));
    };

    // Delete item (DELETE)
    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this equipment?")) return;

        deleteItem(id)
            .then(() => {
                setItems(items.filter((item) => item.id !== id));
            })
            .catch((err) => alert(`Error: ${err.message}`));
    };

    // Search & Filter calculation (filters list in memory without network calls)
    const filteredItems = items.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" ||
            item.category.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });

    if (loading) return <h2>Loading equipment list...</h2>;
    if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;

    return (
        <div>
            <h2>Equipment Catalogue</h2>

            {/* Search and Filter Controls */}
            <div style={{ display: "flex", gap: "10px", margin: "15px 0", flexWrap: "wrap" }}>
                <input
                    type="text"
                    placeholder="Search by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                />

                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                    <option value="All">All Categories</option>
                    <option value="Audio">Audio</option>
                    <option value="Video">Video</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {/* Equipment Cards List */}
            {filteredItems.length === 0 ? (
                <p style={{ color: "#666", fontStyle: "italic" }}>
                    No equipment matches your search filter.
                </p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {filteredItems.map((item) => (
                        <li
                            key={item.id}
                            style={{
                                background: "#fafafa",
                                marginBottom: "12px",
                                padding: "16px",
                                borderRadius: "6px",
                                border: "1px solid #ddd",
                            }}
                        >
                            {/* CLICKABLE ITEM NAME: Takes user to /items/:id detail view */}
                            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                                <Link
                                    to={`/items/${item.id}`}
                                    style={{ color: "#007bff", textDecoration: "none" }}
                                >
                                    {item.name}
                                </Link>{" "}
                                <span style={{ fontSize: "14px", color: "#666" }}>
                                    ({item.category})
                                </span>
                            </div>

                            <div style={{ marginTop: "4px", color: "#555" }}>
                                Location: <strong>{item.location}</strong> | Price:{" "}
                                <strong>€{item.dailyPrice}/day</strong>
                            </div>

                            <div style={{ marginTop: "4px" }}>
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

                            {/* Action Buttons */}
                            <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                                <button
                                    onClick={() => handleToggleAvailable(item.id, item.available)}
                                    style={{
                                        padding: "6px 12px",
                                        backgroundColor: item.available ? "#28a745" : "#ffc107",
                                        color: item.available ? "white" : "black",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    {item.available ? "Borrow" : "Return"}
                                </button>

                                <button
                                    onClick={() => handleDelete(item.id)}
                                    style={{
                                        padding: "6px 12px",
                                        backgroundColor: "#dc3545",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ItemList;
