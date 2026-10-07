import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
// Import API function from central api.js module
import { fetchItemById } from "../api";

function ItemDetail() {
    // useParams() reads the dynamic :id parameter from the browser URL (e.g. /items/1)
    const { id } = useParams();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch details for this specific item on page load
    useEffect(() => {
        fetchItemById(id)
            .then((data) => {
                setItem(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]); // Re-run if ID in URL changes

    if (loading) return <h2>Loading item details...</h2>;
    if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;
    if (!item) return <h2>Item not found.</h2>;

    return (
        <div>
            <Link to="/items" style={{ color: "#007bff", textDecoration: "none" }}>
                &larr; Back to Equipment List
            </Link>

            <h2 style={{ marginTop: "15px" }}>{item.name}</h2>

            <div
                style={{
                    background: "#fafafa",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    marginTop: "15px",
                }}
            >
                <p>
                    <strong>Category:</strong> {item.category}
                </p>
                <p style={{ marginTop: "8px" }}>
                    <strong>Storage Location:</strong> {item.location}
                </p>
                <p style={{ marginTop: "8px" }}>
                    <strong>Condition:</strong> {item.condition || "Good"}
                </p>
                <p style={{ marginTop: "8px" }}>
                    <strong>Daily Price:</strong> €{item.dailyPrice}/day
                </p>
                <p style={{ marginTop: "8px" }}>
                    <strong>Status:</strong>{" "}
                    <span style={{ color: item.available ? "green" : "red", fontWeight: "bold" }}>
                        {item.available ? "Available" : "Borrowed"}
                    </span>
                </p>

                {/* Link to Edit Page */}
                <div style={{ marginTop: "20px" }}>
                    <Link
                        to={`/items/${item.id}/edit`}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#ffc107",
                            color: "black",
                            textDecoration: "none",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            display: "inline-block",
                        }}
                    >
                        Edit Item
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ItemDetail;
