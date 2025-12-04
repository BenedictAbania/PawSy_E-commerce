import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Alert,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
// REMOVED: import productsData from "../data/products.json";
import "../styles/Shop.css";
import ProductCard from "../components/ProductCard";
import LoginRequiredModal from "../components/LoginRequiredModal";

import catImg from "../assets/pets/cat.png";
import dogImg from "../assets/pets/dog.png";
import hamsterImg from "../assets/pets/hamster.png";
import parrotImg from "../assets/pets/parrot.png";
import rabbitImg from "../assets/pets/rabbit.png";
import turtleImg from "../assets/pets/turtle.png";

// 1. BACKEND CONFIG
const API_URL = "http://localhost:8083/api/products";
const IMAGE_BASE_URL = "http://localhost:8083";

const petTypes = [
  { name: "Cat", image: catImg },
  { name: "Dog", image: dogImg },
  { name: "Hamster", image: hamsterImg },
  { name: "Parrot", image: parrotImg },
  { name: "Rabbit", image: rabbitImg },
  { name: "Turtle", image: turtleImg },
];

const Shop = ({
  favorites: globalFavorites,
  onToggleFavorite: globalToggleFavorite,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 2. PARSE URL PARAMS (Fixes Category Link from Landing Page)
  const queryParams = new URLSearchParams(location.search);
  const initialPet = queryParams.get("petType") || "All";
  const initialCategory = queryParams.get("category") || "All";

  // --- FAVORITES HANDLING ---
  const [localFavorites, setLocalFavorites] = useState([]);
  const favorites = globalFavorites ?? localFavorites;
  const setFavorites = globalFavorites ? () => {} : setLocalFavorites;

  const localToggleFavorite = (product) => {
    const id = product.id;
    setFavorites((prev) =>
      prev.find((item) => item.id === id)
        ? prev.filter((item) => item.id !== id)
        : [...prev, product]
    );
  };
  const onToggleFavorite = globalToggleFavorite || localToggleFavorite;

  // --- PRODUCT DATA STATE ---
  const [allProducts, setAllProducts] = useState([]); // Store full API data
  const [products, setProducts] = useState([]); // Store filtered data
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const [filters, setFilters] = useState({
    petType: initialPet,
    category: initialCategory,
    brand: "All",
    minPrice: 0,
    maxPrice: 200, // Matches your slider max
  });

  // --- CART LOGIC ---
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [alertProduct, setAlertProduct] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalAction, setModalAction] = useState("addToCart");

  // 3. IMAGE HELPER (Fixes Broken Images)
  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/400x400/FFF0E6/CCC?text=No+Image";
    if (path.startsWith("data:")) return path;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/assets")) return path; // Serve from Frontend Public
    return `${IMAGE_BASE_URL}${path}`; // Serve from Backend Storage
  };

  // 4. FETCH PRODUCTS FROM API
  useEffect(() => {
    setIsLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        // Pre-process images so ProductCard gets a valid URL
        const formattedData = data.map((p) => ({
          ...p,
          image: getImageUrl(p.image),
        }));
        setAllProducts(formattedData);
        setProducts(formattedData); // Initialize filtered list
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setIsLoading(false);
      });
  }, []);

  // --- CART HANDLERS ---
  const handleAddToCart = (product) => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      setSelectedProduct(product);
      setModalAction("addToCart");
      setShowLoginModal(true);
      return;
    }

    const updatedCart = [...cartItems];
    const existing = updatedCart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));

    setAlertProduct(product.name);
    setShowCartAlert(true);
    setTimeout(() => setShowCartAlert(false), 2500);
  };

  const handleToggleFavorite = (product) => {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
      setSelectedProduct(product);
      setModalAction("addToWishlist");
      setShowLoginModal(true);
      return;
    }
    onToggleFavorite(product);
  };

  const handleGoToCart = () => {
    navigate("/cart");
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // --- FILTER LOGIC ---
  const handleFilterChange = (field, value) => {
    if (field === "petType") {
      setFilters({
        ...filters,
        petType: filters.petType === value ? "All" : value,
      });
    } else {
      setFilters({ ...filters, [field]: value });
    }
  };

  // Apply Filters to allProducts
  useEffect(() => {
    let filtered = allProducts; // Start with full data

    if (filters.petType !== "All") {
      filtered = filtered.filter((p) => p.petType === filters.petType);
    }
    if (filters.category !== "All") {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters.brand !== "All") {
      filtered = filtered.filter((p) => p.brand === filters.brand);
    }

    filtered = filtered.filter(
      (p) =>
        Number(p.price) >= filters.minPrice &&
        Number(p.price) <= filters.maxPrice
    );

    setProducts(filtered);
  }, [filters, allProducts]);

  // Sync Filters with URL (Back/Forward navigation)
  useEffect(() => {
    const petFromQuery = queryParams.get("petType") || "All";
    const catFromQuery = queryParams.get("category") || "All";

    setFilters((prev) => ({
      ...prev,
      petType: petFromQuery,
      category: catFromQuery,
    }));
  }, [location.search]);

  // --- UI ---
  return (
    <Container className="my-5">
      <Alert
        variant="success"
        show={showCartAlert}
        onClose={() => setShowCartAlert(false)}
        dismissible
        className="cart-alert"
      >
        Added <strong>{alertProduct}</strong> to your cart!
      </Alert>

      <section className="shop-by-pet-section text-center mb-5">
        <h3 className="section-title">Shop by Pet</h3>
        <div className="pet-icons d-flex justify-content-center gap-4 mt-4 flex-wrap">
          {petTypes.map((pet) => (
            <div
              key={pet.name}
              className={`pet-icon-container ${
                filters.petType === pet.name ? "active" : ""
              }`}
              onClick={() => handleFilterChange("petType", pet.name)}
              role="button"
              tabIndex={0}
            >
              <img src={pet.image} alt={pet.name} className="pet-icon-image" />
              <p>{pet.name}</p>
            </div>
          ))}
        </div>
      </section>

      <Row>
        {/* SIDEBAR FILTERS */}
        <Col md={3}>
          <div className="mb-4 filter-section">
            <h5>Filter by Category</h5>
            {[
              "All",
              "Accessories",
              "Food",
              "Furniture",
              "Bags",
              "Toys",
              "Treats",
            ].map((cat) => (
              <Form.Check
                key={cat}
                label={cat}
                name="category"
                type="radio"
                id={`cat-${cat}`}
                value={cat}
                checked={filters.category === cat}
                onChange={() => handleFilterChange("category", cat)}
              />
            ))}
          </div>

          <div className="mb-4 filter-section">
            <h5>Filter by Brand</h5>
            {["All", "PawBrand", "Royal Canin", "WhiskerCo", "Jinx"].map(
              (brand) => (
                <Form.Check
                  key={brand}
                  label={brand}
                  name="brand"
                  type="radio"
                  id={`brand-${brand}`}
                  value={brand}
                  checked={filters.brand === brand}
                  onChange={() => handleFilterChange("brand", brand)}
                />
              )
            )}
          </div>

          <div className="mb-4 filter-section">
            <h5>Filter by Price</h5>
            <Form.Label>Min: ${filters.minPrice}</Form.Label>
            <Form.Range
              min={0}
              max={200}
              step={5}
              value={filters.minPrice}
              onChange={(e) =>
                handleFilterChange("minPrice", parseInt(e.target.value))
              }
            />
            <Form.Label>Max: ${filters.maxPrice}</Form.Label>
            <Form.Range
              min={0}
              max={200}
              step={5}
              value={filters.maxPrice}
              onChange={(e) =>
                handleFilterChange("maxPrice", parseInt(e.target.value))
              }
            />
          </div>

          {cartItems.length > 0 && (
            <Button
              variant="warning"
              className="w-100 mt-3"
              onClick={handleGoToCart}
            >
              Go to Cart ({cartItems.length})
            </Button>
          )}
        </Col>

        {/* PRODUCT GRID */}
        <Col md={9}>
          <h2 className="mb-4">Products</h2>
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="warning" />
              <p>Loading products...</p>
            </div>
          ) : (
            <Row>
              {products.length > 0 ? (
                products.map((product) => (
                  <Col lg={4} md={6} xs={12} className="mb-4" key={product.id}>
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      isFavorite={favorites.some(
                        (fav) => fav.id === product.id
                      )}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </Col>
                ))
              ) : (
                <Col>
                  <p>No products match the current filters.</p>
                </Col>
              )}
            </Row>
          )}
        </Col>
      </Row>

      {/* Login Required Modal */}
      {showLoginModal && (
        <LoginRequiredModal
          product={selectedProduct}
          onClose={() => setShowLoginModal(false)}
          action={modalAction}
        />
      )}
    </Container>
  );
};

export default Shop;
