import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Alert, Button, Form } from "react-bootstrap";
import productsData from "../data/products.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import "../styles/Shop.css";
import ProductCard from "../components/ProductCard";

import catImg from "../assets/pets/cat.png";
import dogImg from "../assets/pets/dog.png";
import hamsterImg from "../assets/pets/hamster.png";
import parrotImg from "../assets/pets/parrot.png";
import rabbitImg from "../assets/pets/rabbit.png";
import turtleImg from "../assets/pets/turtle.png";

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
  const queryParams = new URLSearchParams(location.search);
  const initialPet = queryParams.get("petType") || "All";

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

  // --- PRODUCT FILTERS ---
  const [products, setProducts] = useState(productsData);
  const [filters, setFilters] = useState({
    petType: initialPet,
    category: "All",
    brand: "All",
    minPrice: 0,
    maxPrice: 100,
  });

  // --- CART LOGIC ---
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [alertProduct, setAlertProduct] = useState("");

  const handleAddToCart = (product) => {
    const updatedCart = [...cartItems];
    const existing = updatedCart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart)); // Save persistently

    setAlertProduct(product.name);
    setShowCartAlert(true);
    setTimeout(() => setShowCartAlert(false), 2500);
  };

  const handleGoToCart = () => {
    navigate("/cart"); // No need to pass state — CartPage reads from localStorage
  };

  // --- Keep localStorage updated when cart changes ---
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

  useEffect(() => {
    let filtered = productsData;

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
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    setProducts(filtered);
  }, [filters]);

  useEffect(() => {
    const petFromQuery = queryParams.get("petType");
    if (petFromQuery && petFromQuery !== filters.petType) {
      setFilters((prev) => ({ ...prev, petType: petFromQuery }));
    }
  }, [location.search]);

  // --- UI ---
  return (
    <Container className="my-5">
      {/* Floating Cart Alert */}
      <Alert
        variant="success"
        show={showCartAlert}
        onClose={() => setShowCartAlert(false)}
        dismissible
        className="cart-alert"
      >
        Added <strong>{alertProduct}</strong> to your cart!
      </Alert>

      {/* SHOP BY PET SECTION */}
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
              onKeyPress={(e) =>
                e.key === "Enter" && handleFilterChange("petType", pet.name)
              }
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
          <Row>
            {products.length > 0 ? (
              products.map((product) => (
                <Col lg={4} md={6} xs={12} className="mb-4" key={product.id}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    isFavorite={favorites.some((fav) => fav.id === product.id)}
                    onToggleFavorite={onToggleFavorite}
                  />
                </Col>
              ))
            ) : (
              <Col>
                <p>No products match the current filters.</p>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Shop;
