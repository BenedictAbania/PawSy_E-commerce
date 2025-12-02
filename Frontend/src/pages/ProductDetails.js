import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Image, Alert, Breadcrumb, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faHeart as faHeartSolid, faShoppingCart, faChevronLeft, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
// Assuming products.json is in src/data
import productsData from '../data/products.json';
import '../styles/ProductDetails.css'; // We'll create this next

// --- Star Rating Component (copied from ProductCard for consistency) ---
const StarRating = ({ rating, reviewCount }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FontAwesomeIcon icon={faStar} key={`full-${i}`} />);
  }
  if (halfStar) {
    stars.push(<FontAwesomeIcon icon={faStarHalfAlt} key="half" />);
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FontAwesomeIcon icon={faStarEmpty} key={`empty-${i}`} />);
  }
  const ratingText = reviewCount ? `${rating.toFixed(1)} / 5.0 (${reviewCount})` : `${rating.toFixed(1)}`;
  
  return (
    <div className="details-star-rating">
      {stars} <span className="rating-value"> {ratingText}</span>
    </div>
  );
};
// --- End Star Rating Component ---


// --- Main Component ---
const ProductDetails = ({ favorites, onToggleFavorite }) => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null); // State for color selection
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [alertProduct, setAlertProduct] = useState("");
  const [product, setProduct] = useState(null); // State to hold the found product

  // Find the product when the component mounts or ID changes
  useEffect(() => {
    const foundProduct = productsData.find((p) => p.id === parseInt(id));
    setProduct(foundProduct);
    if (foundProduct && foundProduct.colors && foundProduct.colors.length > 0) {
      setSelectedColor(foundProduct.colors[0]); // Select first color by default
    }
    setQuantity(1); // Reset quantity when product changes
  }, [id]); // Re-run effect if the ID in the URL changes

  // Loading or Not Found state
  if (!product) {
    return (
      <Container className="my-5 text-center">
        {/* Basic loading/not found message */}
        <p>Loading product details or product not found...</p>
        <Button variant="outline-secondary" onClick={() => navigate('/shop')}>Back to Shop</Button>
      </Container>
    );
  }

  // Check if the current product is in the favorites list
  const isFavorite = favorites?.some(fav => fav.id === product.id);

  // --- Handlers ---
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.name} (Color: ${selectedColor}) to cart`);
    setAlertProduct(product.name);
    setShowCartAlert(true);
    setTimeout(() => {
      setShowCartAlert(false);
    }, 3000);
    // Add to global cart state here in a real app
  };

  // --- Dummy Features (replace with real data if available) ---
  const features = product.features || [
      "Free 3-5 day shipping",
      "Tool-free assembly",
      "30-day trial"
  ];

  // --- Dummy Colors (replace with real data if available) ---
   const colors = product.colors || ["#F5F5DC", "#90EE90", "#000000", "#FFB6C1"]; // Beige, Green, Black, Pink

  return (
    <>
      {/* --- Floating Cart Alert --- */}
      <Alert
        variant="success"
        show={showCartAlert}
        onClose={() => setShowCartAlert(false)}
        dismissible
        className="cart-alert" // Reusing style from other pages
      >
        Added <strong>{quantity} x {alertProduct}</strong> to your cart!
      </Alert>

      <Container className="product-details-page my-5">
        {/* --- Header with Back Button and Breadcrumb --- */}
        <div className="details-header mb-4">
          <Button variant="link" onClick={() => navigate(-1)} className="back-button">
            <FontAwesomeIcon icon={faChevronLeft} />
          </Button>
          <Breadcrumb className="details-breadcrumb">
             {/* Make breadcrumb dynamic */}
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/shop" }}>Shop</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/shop?category=${product.category}` }}>{product.category}</Breadcrumb.Item>
            <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Row>
          {/* --- Left Column: Image --- */}
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="image-container">
             <Image
                src={product.image}
                alt={product.name}
                fluid
                rounded
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/FFF0E6/CCC?text=Image+Not+Found'; }}
              />
            </div>
          </Col>

          {/* --- Right Column: Info --- */}
          <Col lg={6}>
            <h1 className="product-title">{product.name}</h1>

            <div className="price-rating-wrapper">
              <span className="product-price">${product.price.toFixed(2)}</span>
              {/* Render StarRating only if rating exists */}
              {product.rating !== undefined && (
                 <StarRating rating={product.rating} reviewCount={product.reviewCount} />
              )}
            </div>

            <p className="product-description">
              {product.description || "High-quality product description goes here. Mention key benefits and features to attract customers."}
            </p>

            {/* --- Color Selection --- */}
            {colors.length > 0 && (
              <div className="color-selection mb-4">
                <Form.Label className="mb-2">Color:</Form.Label>
                <div className="d-flex gap-2">
                  {colors.map((color) => (
                    <Button
                      key={color}
                      className={`color-swatch ${selectedColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* --- Quantity and Add to Cart --- */}
            <div className="action-buttons mb-4">
              <div className="quantity-selector me-3">
                <Button variant="light" onClick={decreaseQuantity} disabled={quantity <= 1}>−</Button>
                <span className="quantity-display">{quantity}</span>
                <Button variant="light" onClick={increaseQuantity}>+</Button>
              </div>
              <Button
                variant="warning"
                className="add-to-cart-btn"
                onClick={handleAddToCart}
              >
                <FontAwesomeIcon icon={faShoppingCart} className="me-2"/>
                 Add to Cart
              </Button>
            </div>

            {/* --- Features --- */}
            {features.length > 0 && (
                <div className="features-list">
                  {features.map((feature, index) => (
                    <span key={index}>
                      {feature}
                      {index < features.length - 1 && ' • '}
                    </span>
                  ))}
                </div>
            )}

            {/* --- Wishlist and Share --- */}
            <div className="secondary-actions">
              <Button
                variant="link"
                className="wishlist-btn"
                onClick={() => onToggleFavorite(product)}
              >
                <FontAwesomeIcon icon={isFavorite ? faHeartSolid : faHeartRegular} className="me-2" />
                {isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
              {/* Basic Share Button Placeholder */}
              {/* <Button variant="link" className="share-btn">
                 <FontAwesomeIcon icon={faShareAlt} className="me-2" /> Share
              </Button> */}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductDetails;