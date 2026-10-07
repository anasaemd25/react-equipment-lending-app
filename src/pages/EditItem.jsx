import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
// Import API functions from central api.js module
import { fetchItemById, updateItem } from "../api";

function EditItem() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Load state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    // Form draft state
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [dailyPrice, setDailyPrice] = useState("");
    const [location, setLocation] = useState("");
    const [condition, setCondition] = useState("Good");

    // Load current item data into form fields on startup
    useEffect(() => {
        fetchItemById(id)
            .then((data) => {
                setName(data.name);
                setCategory(data.category);
                setDailyPrice(data.dailyPrice);
                setLocation(data.location || "");
                setCondition(data.condition || "Good");
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    // Handle Form Submit (PATCH)
    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);

        const updatedData = {
            name,
            category,
            dailyPrice: Number(dailyPrice),
            location,
            condition,
        };

        updateItem(id, updatedData)
            .then(() => {
                setSaving(false);
                // Requirement 8: navigate to equipment list after successful edit
                navigate("/items");
            })
            .catch((err) => {
                setSaving(false);
                // Requirement 8: if saving fails, keep draft input and show error
                alert(`Failed to save changes: ${err.message}`);
            });
    };

    if (loading) return <h2>Loading equipment details for edit...</h2>;
    if (error) return <h2 style={{ color: "red" }}>Error: {error}</h2>;

    return (
        <div>
            <Link to={`/items/${id}`} style={{ color: "#007bff", textDecoration: "none" }}>
                &larr; Cancel and go back
            </Link>

            <h2 style={{ marginTop: "15px" }}>Edit Equipment #{id}</h2>

            <form onSubmit={handleSubmit} style={{ marginTop: "15px" }}>
                <div style={{ marginBottom: "12px" }}>
                    <label style={{ fontWeight: "bold", display: "block" }}>Equipment Name *</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label style={{ fontWeight: "bold", display: "block" }}>Category *</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label style={{ fontWeight: "bold", display: "block" }}>
                        Daily Price (€) *
                    </label>
                    <input
                        type="number"
                        value={dailyPrice}
                        onChange={(e) => setDailyPrice(e.target.value)}
                        required
                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                    />
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label style={{ fontWeight: "bold", display: "block" }}>Storage Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        style={{ width: "100%", padding: "8px", marginTop: "4px" }}
                    />
                </div>

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

                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: saving ? "#ccc" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        cursor: saving ? "not-allowed" : "pointer",
                    }}
                >
                    {saving ? "Saving changes..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}

export default EditItem;
