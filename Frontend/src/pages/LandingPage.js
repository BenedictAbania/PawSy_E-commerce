import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import heroImage from "../assets/hero-image.png";
import qualityImage from "../assets/dogNcat.png";
import LoginRequiredModal from "../components/LoginRequiredModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import {
  faHeart as faHeartSolid,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { addToCart } from "../utils/cartHelper";

// Assets
import accessoriesImg from "../assets/categories/Accessories.png";
import foodImg from "../assets/categories/Food.png";
import furnitureImg from "../assets/categories/Furniture.png";
import bagImg from "../assets/categories/Bag.png";

const API_URL = "http://localhost:8083/api/products";
const IMAGE_BASE_URL = "http://localhost:8083";

const LandingPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalAction, setModalAction] = useState("addToCart");

  // Load Real Products
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Helpers
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("data:")) return path;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/assets")) return path;
    return `${IMAGE_BASE_URL}${path}`;
  };
  const featuredProducts = products.filter((p) => Boolean(p.is_featured));
  const bestSellingProducts = products.filter((p) => Boolean(p.is_best_seller));

  const categories = [
    { name: "Accessories", image: accessoriesImg },
    { name: "Food", image: foodImg },
    { name: "Furniture", image: furnitureImg },
    { name: "Bags", image: bagImg },
  ];

  const pets = [
    { name: "Cat", image: require("../assets/pets/cat.png") },
    { name: "Dog", image: require("../assets/pets/dog.png") },
    { name: "Hamster", image: require("../assets/pets/hamster.png") },
    { name: "Parrot", image: require("../assets/pets/parrot.png") },
    { name: "Rabbit", image: require("../assets/pets/rabbit.png") },
    { name: "Turtle", image: require("../assets/pets/turtle.png") },
  ];

  // Logic to Add to Cart / Favorite (Same as before)
  const toggleFavorite = (id, product) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      setSelectedProduct(product);
      setModalAction("addToWishlist");
      setShowLoginModal(true);
      return;
    }
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleAddToCart = async (product) => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      setSelectedProduct(product);
      setModalAction("addToCart");
      setShowLoginModal(true);
      return;
    }

    const result = await addToCart(product, 1);
    alert(result.message);
  };

  return (
    <div className="landing-page">
      {/* HERO */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-section">
              <h5 className="brand-name">PawSy</h5>
              <h1>
                Everything Your Pet <br /> Needs, All in One Place.
              </h1>
              <p>
                Discover top pet products, carefully selected by pet lovers.
              </p>
              <Button className="shop-btn" onClick={() => navigate("/shop")}>
                Shop Now
              </Button>
            </Col>
            <Col md={6}>
              <div className="hero-image-container">
                <img src={heroImage} alt="Happy pets" className="hero-image" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CATEGORIES (Fixed Link) */}
      <section className="category-section">
        <Container>
          <h3 className="section-title">Browse by Category</h3>
          <Row className="justify-content-center mt-4">
            {categories.map((cat, index) => (
              <Col key={index} xs={6} md={3} className="text-center">
                <div
                  className="category-item"
                  onClick={() => navigate(`/shop?category=${cat.name}`)}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="category-icon"
                  />
                  <p>{cat.name}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* FEATURED PRODUCTS (Dynamic) */}
      <section className="featured-products">
        <Container>
          <h3 className="section-title text-center fw-bold mb-4">
            Featured Products
          </h3>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="warning" />
            </div>
          ) : (
            <div className="featured-scroll d-flex overflow-auto pb-3">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="feature-card me-3 flex-shrink-0"
                    style={{ width: "18rem" }}
                  >
                    <div
                      style={{
                        height: "200px",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>${Number(product.price).toFixed(2)}</Card.Text>
                      <Button
                        className="add-to-cart-btn w-100 bg-orange border-0"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p className="text-center w-100">No featured products yet.</p>
              )}
            </div>
          )}
        </Container>
      </section>

      {/* QUALITY SECTION */}
      <section className="quality-section">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <div className="quality-image">
                <img
                  src={qualityImage}
                  alt="dog and cat"
                  className="quality-img"
                />
              </div>
            </Col>
            <Col md={6}>
              <h3 className="quality-header">Quality you can trust,</h3>
              <h3 className="quality-header2">Comfort they can feel</h3>
              <p>
                Our mission is simple. We provide trusted, affordable, and
                high-quality supplies.
              </p>
              <Button
                className="learn-more-btn"
                onClick={() => navigate("/aboutUs")}
              >
                Learn More
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* BEST SELLING (Dynamic) */}
      <section className="best-selling">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="section-title">Best Selling Products</h3>
            <Button className="shop-all-btn" onClick={() => navigate("/shop")}>
              Shop All
            </Button>
          </div>
          <Row className="mt-4">
            {bestSellingProducts.slice(0, 4).map((product) => (
              <Col key={product.id} xs={6} md={3} className="mb-4">
                <Card className="product-card h-100">
                  <div
                    style={{
                      height: "180px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>${Number(product.price).toFixed(2)}</Card.Text>
                    <Button
                      className="add-to-cart-btn w-100 bg-orange border-0"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* SHOP BY PET */}
      <section className="shop-by-pet-section text-center mb-5">
        <Container>
          <h3 className="section-title">Shop by Pet</h3>
          <Row className="justify-content-center mt-4">
            {pets.map((pet, index) => (
              <Col key={index} xs={4} md={2} className="text-center">
                <div
                  className="pet-icon-container"
                  onClick={() => navigate(`/shop?petType=${pet.name}`)}
                >
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="pet-icon-image"
                  />
                  <p>{pet.name}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {showLoginModal && (
        <LoginRequiredModal
          product={selectedProduct}
          onClose={() => setShowLoginModal(false)}
          action={modalAction}
        />
      )}
    </div>
  );
};

export default LandingPage;
