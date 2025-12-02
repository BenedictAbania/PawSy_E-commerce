
import React, { useState } from "react";

import { Container, Row, Col, Button, Card } from "react-bootstrap";
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


// Import JSON data
import featuredProducts from "../data/featuredProducts.json";
import bestSellingProducts from "../data/bestSellingProducts.json";

// Import category images
import accessoriesImg from "../assets/categories/Accessories.png";
import foodImg from "../assets/categories/Food.png";
import furnitureImg from "../assets/categories/Furniture.png";
import bagImg from "../assets/categories/Bag.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalAction, setModalAction] = useState('addToCart');


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


  // Toggle favorites with login check
  const toggleFavorite = (id, product) => {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
      // User not logged in - show modal
      setSelectedProduct(product);
      setModalAction('addToWishlist');
      setShowLoginModal(true);
      return;
    }

    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  // Handle add to cart with login check
  const handleAddToCart = (product) => {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
      // User not logged in - show modal
      setSelectedProduct(product);
      setModalAction('addToCart');
      setShowLoginModal(true);
    } else {
      // User is logged in - add to cart using cartItems (consistent with Shop)
      const cartRaw = localStorage.getItem('cartItems') || '[]';
      const cart = JSON.parse(cartRaw);
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      
      localStorage.setItem('cartItems', JSON.stringify(cart));
      alert(`${product.name} added to cart!`);
    }
  };


  return (
    <div className="landing-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-section">
              <h5 className="brand-name">PawSy</h5>
              <h1>
                Everything Your Pet <br />
                Needs, All in One Place.
              </h1>
              <p>
                Discover top pet products, carefully selected by pet lovers to
                ensure premium quality, comfort, and value for your beloved
                companions.
              </p>
              <Button className="shop-btn" onClick={() => navigate("/shop")}>
                Shop Now
              </Button>
            </Col>
            <Col md={6} className="image-section">
              <div className="hero-image-container">
                <img src={heroImage} alt="Happy pets" className="hero-image" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* CATEGORY SECTION */}
      <section className="category-section">
        <Container>
          <h3 className="section-title">Browse by Category</h3>
          <Row className="justify-content-center mt-4">
            {categories.map((cat, index) => (
              <Col key={index} xs={6} md={3} className="text-center">
                <div
                  className="category-item"
                  onClick={() =>
                    navigate(`/shop?category=${cat.name.toLowerCase()}`)
                  }
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

      {/* FEATURED PRODUCTS */}
      <section className="featured-products">
        <Container>
          <h3
            className="section-title text-center"
            style={{ fontWeight: "bolder", marginBottom: "1.5rem" }}
          >
            Featured Products
          </h3>
          <div className="featured-scroll d-flex overflow-auto pb-3">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="feature-card me-3 flex-shrink-0"
                style={{ width: "18rem" }}
              >
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>
                    ${product.price.toFixed(2)}
                    <Button
                      variant="link"
                      className="heart-btn p-0"
                      onClick={() => toggleFavorite(product.id, product)}
                    >
                      <FontAwesomeIcon
                        icon={
                          favorites.includes(product.id)
                            ? faHeartSolid
                            : faHeartRegular
                        }
                      />
                    </Button>
                  </Card.Text>
                  <Button
                    className="add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                    style={{ width: '100%', backgroundColor: '#f97316', border: 'none' }}
                  >
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
          <div className="arrow-buttons-below text-center mt-3">
            <Button
              variant="dark"
              className="arrow-btn me-3"
              onClick={() =>
                (document.querySelector(".featured-scroll").scrollLeft -= 300)
              }
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            <Button
              variant="dark"
              className="arrow-btn"
              onClick={() =>
                (document.querySelector(".featured-scroll").scrollLeft += 300)
              }
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </Button>
          </div>
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
              <p>Our mission is simple. We provide trusted, affordable, and high-quality supplies to help every pet live a happy and healthy life.</p>
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

      {/* BEST SELLING */}
      <section className="best-selling">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="section-title">Best Selling Products</h3>
            <Button className="shop-all-btn" onClick={() => navigate("/shop")}>
              Shop All
            </Button>
          </div>
          <Row className="mt-4">
            {bestSellingProducts.map((product) => (
              <Col key={product.id} xs={6} md={3} className="mb-4">
                <Card className="product-card">
                  <Card.Img
                    variant="top"
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>

                    <Card.Text>
                      ${product.price.toFixed(2)}
                      <Button
                        variant="link"
                        className="heart-btn p-0"
                        onClick={() => toggleFavorite(product.id, product)}
                      >
                        <FontAwesomeIcon
                          icon={
                            favorites.includes(product.id)
                              ? faHeartSolid
                              : faHeartRegular
                          }
                        />
                      </Button>
                    </Card.Text>

                    <Button
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                      style={{ width: '100%', backgroundColor: '#f97316', border: 'none' }}
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
                  onClick={() =>
                    (window.location.href = `/shop?petType=${pet.name}`)
                  }
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

      {/* Login Required Modal */}
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
