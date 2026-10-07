import { Link } from "react-router-dom";

// 404 Page Not Found fallback component
function NotFound() {
    return (
        <div style={{ textAlign: "center", padding: "30px" }}>
            <h2 style={{ fontSize: "36px", color: "#dc3545" }}>404 - Page Not Found</h2>
            <p style={{ margin: "15px 0" }}>The URL path you entered does not exist.</p>
            {/* Link back to home page */}
            <Link to="/" style={{ color: "#007bff", fontWeight: "bold" }}>
                Return to Home Page
            </Link>
        </div>
    );
}

export default NotFound;
