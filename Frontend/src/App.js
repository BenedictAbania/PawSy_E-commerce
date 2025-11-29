import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";


import NavBar from "./components/Navbar";
import Footer from "./components/Footer";


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
import ProductList from "./pages/ProductList";
import Wishlist from "./pages/Wishlist";


import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Products from "./admin/Products";
import Users from "./admin/Users";
import "./admin/Admin.css";

function App() {
  
  const [favorites, setFavorites] = useState([]);

  
  const toggleFavorite = (product) => {
    setFavorites((prev) =>
      prev.find((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id) 
        : [...prev, product] 
    );
  };

  
  const UserLayout = () => (
    <>
      <NavBar favoritesCount={favorites.length} />
      <div style={{ minHeight: "80vh" }}>
        <Outlet /> {}
      </div>
      <Footer />
    </>
  );

  return (
    <BrowserRouter>
      <Routes>
        
        {}
        <Route element={<UserLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/account" element={<Account />} />
            <Route path="/edit-profile" element={<EditProfile />} />

            {}
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutAddress />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/confirmation" element={<div>Order Confirmation Page</div>} />

            {}
            <Route
              path="/shop"
              element={<Shop favorites={favorites} onToggleFavorite={toggleFavorite} />}
            />
            <Route
              path="/shop/:id"
              element={<ProductDetails favorites={favorites} onToggleFavorite={toggleFavorite} />}
            />
            <Route
              path="/products"
              element={<ProductList favorites={favorites} onToggleFavorite={toggleFavorite} />}
            />
            <Route
              path="/wishlist"
              element={<Wishlist favorites={favorites} onToggleFavorite={toggleFavorite} />}
            />
        </Route>


        {}
        {}
        <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<Dashboard />} /> 
           <Route path="dashboard" element={<Dashboard />} />
           <Route path="products" element={<Products />} />
           <Route path="users" element={<Users />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;