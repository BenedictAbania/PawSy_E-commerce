import React, { useState } from "react"; // Ensure useState is imported
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- Core Components ---
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";

// --- Page Imports (Ensure all are present) ---
import LandingPage from "./pages/LandingPage";
import Shop from "./pages/Shop";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Account from "./pages/Account";
import EditProfile from "./pages/EditProfile";
import CartPage from "./pages/CartPage";
import CheckoutAddress from "./pages/Checkout_Address";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import ProductDetails from "./pages/ProductDetails";
import ProductList from "./pages/ProductList"; // Assuming you use this
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  // --- Global Wishlist State ---
  const [favorites, setFavorites] = useState([]);

  // --- Global Wishlist Toggle Function ---
  const toggleFavorite = (product) => {
    setFavorites((prev) =>
      prev.find((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id) // Remove if exists
        : [...prev, product] // Add if doesn't exist
    );
  };

  return (
    <BrowserRouter>
      {/* Pass favorites count to NavBar */}
      <NavBar favoritesCount={favorites.length} />

      {/* --- ALL ROUTES MUST BE INSIDE <Routes> --- */}
      <Routes>
        {/* Original Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/account" element={<Account />} />
        <Route path="/edit-profile" element={<EditProfile />} />

        {/* Checkout Flow Routes */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutAddress />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirmation" element={<div>Order Confirmation Page</div>} />

        {/* Routes Receiving Wishlist Props */}
        <Route
          path="/shop"
          element={
            <Shop
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          }
        />
        <Route
          path="/shop/:id"
          element={
            <ProductDetails
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          }
        />
         <Route
          path="/products" // Assuming you use ProductList
          element={
            <ProductList
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          }
        />
         <Route
          path="/wishlist"
          element={
            <Wishlist
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          }
        />
        {/* Login and Signup Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      {/* --- END OF ROUTES --- */}

      <Footer />
    </BrowserRouter>
  );
}

export default App;