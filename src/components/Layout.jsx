// Import NavLink (for highlighted active links) and Outlet (where child pages show up)
import { NavLink, Outlet } from "react-router-dom";

// Layout component wraps around all our pages
function Layout() {
    // Styling object for active links (turns link text bold and underlined when on that page)
    const getLinkStyle = ({ isActive }) => ({
        color: isActive ? "#007bff" : "#333", // Blue if active, dark grey if inactive
        textDecoration: isActive ? "underline" : "none", // Underline active page link
        fontWeight: isActive ? "bold" : "normal", // Bold active page link
        padding: "8px 12px",
    });

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
            {/* Top Header Navigation Bar */}
            <header
                style={{
                    background: "#ffffff",
                    padding: "15px 20px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
            >
                <h1 style={{ margin: "0 0 10px 0", fontSize: "24px" }}>
                    Equipment Lending Catalogue
                </h1>

                {/* Navigation Links */}
                <nav style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {/* Link to Home page (/) */}
                    <NavLink to="/" style={getLinkStyle}>
                        Home
                    </NavLink>

                    {/* Link to Items Catalogue (/items) */}
                    <NavLink to="/items" style={getLinkStyle}>
                        Equipment List
                    </NavLink>

                    {/* Link to Add Item Form (/items/new) */}
                    <NavLink to="/items/new" style={getLinkStyle}>
                        + Add Equipment
                    </NavLink>

                    {/* Link to External API Page (/external) */}
                    <NavLink to="/external" style={getLinkStyle}>
                        External Products
                    </NavLink>
                </nav>
            </header>

            {/* Main Content Area: <Outlet /> renders whichever child page route is currently active */}
            <main
                style={{
                    background: "#ffffff",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
            >
                <Outlet />
            </main>
        </div>
    );
}

// Export Layout so App.jsx can import it
export default Layout;
