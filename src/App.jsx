// 1. Import Router components from 'react-router-dom' (notice the hyphen)
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 2. Import our Shared Layout (the picture frame containing the navigation bar and <Outlet />)
import Layout from "./components/Layout";

// 3. Import all page views
import Home from "./pages/Home";
import ItemList from "./pages/ItemList";
import ItemDetail from "./pages/ItemDetail";
import EditItem from "./pages/EditItem";
import AddItem from "./pages/AddItem";
import ExternalProducts from "./pages/ExternalProducts";
import NotFound from "./pages/NotFound";

// Main App Router Switchboard Function
function App() {
    return (
        // BrowserRouter enables client-side URL navigation without full browser reloads
        <BrowserRouter>
            {/* Routes holds all individual Route paths defined in our app */}
            <Routes>
                {/* Layout Route: Wraps all child pages inside one shared navigation frame */}
                <Route path="/" element={<Layout />}>
                    {/* Default Home view when path is exactly '/' */}
                    <Route index element={<Home />} />

                    {/* Equipment Catalogue view when path is '/items' */}
                    <Route path="items" element={<ItemList />} />

                    {/* Add New Equipment form view when path is '/items/new' */}
                    {/* MUST be placed BEFORE 'items/:id' so React Router doesn't mistake 'new' for an item ID */}
                    <Route path="items/new" element={<AddItem />} />

                    {/* Item Detail view when path is '/items/1', '/items/2', etc. */}
                    <Route path="items/:id" element={<ItemDetail />} />

                    {/* Edit Item form view when path is '/items/1/edit', etc. */}
                    <Route path="items/:id/edit" element={<EditItem />} />

                    {/* External Public API view when path is '/external' */}
                    <Route path="external" element={<ExternalProducts />} />

                    {/* Fallback 404 view for any unknown URL paths (e.g. '/random-url') */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

// Export App so main.jsx can render it inside index.html
export default App;
