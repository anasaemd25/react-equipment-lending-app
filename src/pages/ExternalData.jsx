// Import React hooks
import { useState, useEffect } from "react";

function ExternalData() {
    // State variables for external data, loading, and errors
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Requirement 5: Start GET request inside useEffect when component loads
    useEffect(() => {
        // Fetch external sample tech products from public DummyJSON API
        fetch("https://dummyjson.com/products/category/smartphones")
            .then((response) => {
                // Requirement 5: Check HTTP response before treating as successful
                if (!response.ok) {
                    throw new Error("Failed to fetch data from external API");
                }
                return response.json();
            })
            .then((data) => {
                // DummyJSON returns an object with a 'products' array
                setProducts(data.products || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Requirement 5: Show Loading Outcome
    if (loading) return <h2>Loading external product recommendations...</h2>;

    // Requirement 5: Show Failure Outcome
    if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;

    return (
        <div>
            <h2>External Product Recommendations</h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>
                <em>
                    Note: This data is fetched live from an external public API (DummyJSON) and is
                    completely separate from our Express server.
                </em>
            </p>

            {/* Requirement 5: Show Empty Outcome */}
            {products.length === 0 ? (
                <p>No external products found.</p>
            ) : (
                /* Requirement 5: Show Success Outcome rendering multiple returned objects */
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                        gap: "15px",
                    }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                padding: "12px",
                                background: "#fafafa",
                                textAlign: "center",
                            }}
                        >
                            <img
                                src={product.thumbnail}
                                alt={product.title}
                                style={{
                                    width: "100%",
                                    height: "120px",
                                    objectFit: "contain",
                                    marginBottom: "8px",
                                }}
                            />
                            <h4 style={{ margin: "5px 0" }}>{product.title}</h4>
                            <p style={{ color: "#555", fontSize: "14px", margin: "5px 0" }}>
                                Category: {product.category}
                            </p>
                            <p style={{ fontWeight: "bold", color: "#28a745" }}>${product.price}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// Export component so App.jsx can use it
export default ExternalData;
