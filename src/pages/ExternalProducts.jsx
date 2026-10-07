// 1. Import React tools:
// 'useState' holds smart whiteboard variables for products, loading, and error states.
// 'useEffect' automatically triggers the fetch request when the page loads.
import { useState, useEffect } from "react";

// Main component function for the External API View
function ExternalProducts() {
    // Smart whiteboard state to hold the list of external products fetched from DummyJSON
    const [products, setProducts] = useState([]);

    // Smart whiteboard state to track if the data is currently downloading (starts as true)
    const [loading, setLoading] = useState(true);

    // Smart whiteboard state to hold any network error message if the fetch fails (starts as null)
    const [error, setError] = useState(null);

    // --- GET REQUEST TO EXTERNAL API ---
    // useEffect runs automatically ONCE when the user clicks onto the 'External Products' tab
    useEffect(() => {
        // Fetch 6 sample items from DummyJSON (a free public practice API)
        fetch("https://dummyjson.com/products?limit=6")
            .then((response) => {
                // Section 5 requirement: check HTTP response before treating request as successful
                if (!response.ok) {
                    throw new Error("Failed to fetch data from external API service.");
                }
                // Convert raw JSON response text into a usable JavaScript object
                return response.json();
            })
            .then((data) => {
                // DummyJSON wraps its item array inside a 'products' key: data.products
                setProducts(data.products || []);
                // Turn off the loading message because downloading is complete
                setLoading(false);
            })
            .catch((err) => {
                // Save the error message so we can show it to the user
                setError(err.message);
                // Turn off loading text so the error view appears
                setLoading(false);
            });
    }, []); // Empty [] dependency array means: run this trigger ONLY ONCE on page load

    // --- CONDITIONAL SCREEN RENDERING (Section 5 requirements) ---

    // 1. Show Loading outcome while request is pending
    if (loading) return <h2>Loading external product recommendations...</h2>;

    // 2. Show Failure outcome with a useful error message if fetch fails
    if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;

    // 3. Show Empty outcome if external API returns 0 items
    if (products.length === 0) return <h2>No external products found.</h2>;

    // 4. Show Success outcome with rendered data
    return (
        <div>
            {/* Title and explanation identifying the external service (Requirement 10) */}
            <h2>External Audio & Tech Accessories</h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>
                <em>
                    Note: This data is fetched live from the external public API (DummyJSON) and is
                    read-only. It is completely separate from internal Express server.
                </em>
            </p>

            {/* Grid container to render returned product cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "15px",
                }}
            >
                {/* Loop through external products array using .map() */}
                {products.map((product) => (
                    <div
                        key={product.id} // Unique key required by React for list items
                        style={{
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            padding: "15px",
                            background: "#fafafa",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        }}
                    >
                        {/* Product Image */}
                        <img
                            src={product.thumbnail}
                            alt={product.title}
                            style={{
                                width: "100%",
                                height: "120px",
                                objectFit: "contain",
                                marginBottom: "10px",
                            }}
                        />

                        {/* Product Title */}
                        <h3 style={{ fontSize: "16px", margin: "0 0 8px 0", color: "#222" }}>
                            {product.title}
                        </h3>

                        {/* Product Description */}
                        <p
                            style={{
                                fontSize: "13px",
                                color: "#666",
                                height: "40px",
                                overflow: "hidden",
                            }}
                        >
                            {product.description}
                        </p>

                        {/* Product Price */}
                        <div style={{ fontWeight: "bold", color: "#007bff", marginTop: "10px" }}>
                            Price: ${product.price}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Export component so React Router in App.jsx can import and render it
export default ExternalProducts;
