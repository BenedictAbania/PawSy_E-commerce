import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import NavBar from "./components/Navbar";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import Shop from "./pages/Shop";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Account from "./pages/Account"; // If unused, you can remove
import EditProfile from "./pages/EditProfile";
import CartPage from "./pages/CartPage";
import CheckoutAddress from "./pages/Checkout_Address";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import ProductDetails from "./pages/ProductDetails";
import ProductList from "./pages/ProductList";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyProfile from "./pages/MyProfile";
import TrackOrders from "./pages/TrackOrders";
import MyCancellations from "./pages/MyCancellations";
import MyReturns from './pages/MyReturns';
import MyPaymentOptions from './pages/MyPaymentOptions'; 

// Admin Imports
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Products from "./admin/Products";
import Users from "./admin/Users";
import AdminMessages from "./admin/AdminMessages"; 
import "./admin/Admin.css";

import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "./utils/wishlistHelper";

// --- Protected Route Component ---
const ProtectedRoute = ({ children }) => {
  const currentUser = localStorage.getItem("currentUser");
  return currentUser ? children : <Navigate to="/login" replace />;
};

function App() {
  // Global cart state
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState([]);

  // Fetch Wishlist
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      getWishlist()
        .then((items) => {
          setFavorites(items.map((w) => w.product));
        })
        .catch(() => {
          /* ignore */
        });
    } else {
      const raw = localStorage.getItem("favorites");
      if (raw) setFavorites(JSON.parse(raw));
    }
  }, []);

  // Add to cart handler
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      let newCart;
      if (existing) {
        newCart = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prev, { ...product, quantity }];
      }
      localStorage.setItem("cartItems", JSON.stringify(newCart));
      return newCart;
    });
    return { success: true, message: product.name };
  };

  const toggleFavorite = async (product) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      setFavorites((prev) =>
        prev.find((p) => p.id === product.id)
          ? prev.filter((p) => p.id !== product.id)
          : [...prev, product]
      );
      return;
    }

    const exists = favorites.some((p) => p.id === product.id);
    try {
      if (exists) {
        await removeFromWishlist(product.id);
        setFavorites((prev) => prev.filter((p) => p.id !== product.id));
      } else {
        await addToWishlist(product.id);
        setFavorites((prev) => [...prev, product]);
      }
    } catch (err) {
      console.error("Wishlist API error", err);
    }
  };

  // --- USER LAYOUT (The Sandwich Wrapper) ---
  const UserLayout = () => (
    <>
      <NavBar favoritesCount={favorites.length} cartCount={cartItems.length} />
      <div style={{ minHeight: "80vh" }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );

  return (
    <BrowserRouter>
      <Routes>
        
        {/* === MAIN CUSTOMER ROUTES (With Navbar & Footer) === */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Shop Routes */}
          <Route
            path="/shop"
            element={
              <Shop
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route
            path="/shop/:id"
            element={
              <ProductDetails
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route
            path="/products"
            element={
              <ProductList
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onAddToCart={handleAddToCart}
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

          {/* Checkout Flow (Protected) */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutAddress />
              </ProtectedRoute>
            }
          />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<div>Order Confirmation Page</div>} />

          {/* Account Pages (Protected) */}
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/track-orders" element={<TrackOrders />} />

          {/* --- MOVED THESE INSIDE USERLAYOUT --- */}
          <Route 
            path="/cancellations" 
            element={
              <ProtectedRoute>
                <MyCancellations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/returns" 
            element={
              <ProtectedRoute>
                <MyReturns />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-payment-options" 
            element={
              <ProtectedRoute>
                <MyPaymentOptions />
              </ProtectedRoute>
            } 
          />
        </Route>
        {/* === END CUSTOMER ROUTES === */}


        {/* === ADMIN ROUTES (Different Layout) === */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;