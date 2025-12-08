import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Button, Image, Alert, Breadcrumb, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faHeart as faHeartSolid, faShoppingCart, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { addToCart } from '../utils/cartHelper';
import '../styles/ProductDetails.css'; 

const API_URL = 'http://localhost:8083/api/products';
const IMAGE_BASE_URL = 'http://localhost:8083';

const StarRating = ({ rating, reviewCount }) => {
  const stars = [];
  const validRating = Number(rating) || 0;
  const fullStars = Math.floor(validRating);
  const halfStar = validRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FontAwesomeIcon icon={faStar} key={`full-${i}`} className="text-warning" />);
  }
  if (halfStar) {
    stars.push(<FontAwesomeIcon icon={faStarHalfAlt} key="half" className="text-warning" />);
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FontAwesomeIcon icon={faStarEmpty} key={`empty-${i}`} className="text-warning" />);
  }
  
  const ratingText = reviewCount 
    ? `${validRating.toFixed(1)} / 5.0 (${reviewCount} reviews)` 
    : `${validRating.toFixed(1)} / 5.0`;
  
  return (
    <div className="details-star-rating mb-2">
      {stars} <span className="rating-value ms-2 text-muted" style={{fontSize: '0.9rem'}}>{ratingText}</span>
    </div>
  );
};

const ProductDetails = ({ favorites, onToggleFavorite }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [alertProduct, setAlertProduct] = useState("");
  const [product, setProduct] = useState(null);

  const getImageUrl = (path) => {
    if (!path) return "https://placehold.co/600x600/FFF0E6/CCC?text=No+Image";
    if (path.startsWith('data:')) return path;
    if (path.startsWith('http')) return path;
    return `${IMAGE_BASE_URL}${path}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/${id}`);
        if (response.ok) {
          const data = await response.json();
          
          const formattedProduct = {
            ...data,
            image: getImageUrl(data.image),
            // Map the Laravel fields to our React props
            rating: data.reviews_avg_rating, // This comes from withAvg
            reviewCount: data.reviews_count  // This comes from withCount
          };
          
          setProduct(formattedProduct);
          if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      }
      setQuantity(1);
    };
    
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <Container className="my-5 text-center">
        <p>Loading product details...</p>
        <Button variant="outline-secondary" onClick={() => navigate('/shop')}>Back to Shop</Button>
      </Container>
    );
  }

  const isFavorite = favorites?.some(fav => fav.id === product.id);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const result = await addToCart(product, quantity);
    setAlertProduct(result.message);
    setShowCartAlert(true);
    setTimeout(() => {
      setShowCartAlert(false);
    }, 3000);
  };

  const features = product.features || [
      "Free 3-5 day shipping",
      "Tool-free assembly",
      "30-day trial"
  ];

   const colors = product.colors || ["#F5F5DC", "#90EE90", "#000000", "#FFB6C1"];

  return (
    <>
      <Alert
        variant="success"
        show={showCartAlert}
        onClose={() => setShowCartAlert(false)}
        dismissible
        className="cart-alert"
        style={{position: 'fixed', top: '20px', right: '20px', zIndex: 9999}}
      >
        Added <strong>{quantity} x {alertProduct}</strong> to your cart!
      </Alert>

      <Container className="product-details-page my-5">
        <div className="details-header mb-4">
          <Button variant="link" onClick={() => navigate(-1)} className="back-button text-dark text-decoration-none p-0 me-3">
            <FontAwesomeIcon icon={faChevronLeft} /> Back
          </Button>
          <Breadcrumb className="details-breadcrumb d-inline-block">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/shop" }}>Shop</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/shop?category=${product.category}` }}>{product.category}</Breadcrumb.Item>
            <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Row>
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="image-container bg-light rounded p-3 d-flex align-items-center justify-content-center" style={{minHeight: '400px'}}>
             <Image
                src={product.image}
                alt={product.name}
                fluid
                rounded
                style={{maxHeight: '500px', objectFit: 'contain'}}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/FFF0E6/CCC?text=Image+Not+Found'; }}
              />
            </div>
          </Col>

          <Col lg={6}>
            <h1 className="product-title fw-bold">{product.name}</h1>

            <div className="price-rating-wrapper mb-3">
              <span className="product-price fs-2 fw-bold text-dark me-3">${Number(product.price).toFixed(2)}</span>
              {/* Always show rating component, let it handle 0s */}
              <div className="d-inline-block">
                 <StarRating rating={product.rating} reviewCount={product.reviewCount} />
              </div>
            </div>

            <p className="product-description text-muted mb-4">
              {product.description || "High-quality product description goes here. Mention key benefits and features to attract customers."}
            </p>

            {colors.length > 0 && (
              <div className="color-selection mb-4">
                <Form.Label className="mb-2 fw-bold">Color:</Form.Label>
                <div className="d-flex gap-2">
                  {colors.map((color) => (
                    <Button
                      key={color}
                      className={`color-swatch rounded-circle border-0 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                      style={{ 
                          backgroundColor: color, 
                          width: '30px', 
                          height: '30px', 
                          border: selectedColor === color ? '2px solid #000' : '1px solid #ddd' 
                      }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="action-buttons mb-4 d-flex align-items-center gap-3">
              <div className="quantity-selector d-flex align-items-center border rounded">
                <Button variant="light" className="border-0 px-3" onClick={decreaseQuantity} disabled={quantity <= 1}>−</Button>
                <span className="quantity-display px-3 fw-bold">{quantity}</span>
                <Button variant="light" className="border-0 px-3" onClick={increaseQuantity}>+</Button>
              </div>
              <Button
                variant="warning"
                className="add-to-cart-btn px-4 py-2 text-white fw-bold"
                onClick={handleAddToCart}
              >
                <FontAwesomeIcon icon={faShoppingCart} className="me-2"/>
                 Add to Cart
              </Button>
            </div>

            {features.length > 0 && (
                <div className="features-list text-muted small mb-4">
                  {features.map((feature, index) => (
                    <span key={index}>
                      {feature}
                      {index < features.length - 1 && ' • '}
                    </span>
                  ))}
                </div>
            )}

            <div className="secondary-actions">
              <Button
                variant="link"
                className="wishlist-btn text-decoration-none text-muted p-0"
                onClick={() => onToggleFavorite(product)}
              >
                <FontAwesomeIcon icon={isFavorite ? faHeartSolid : faHeartRegular} className={`me-2 ${isFavorite ? 'text-danger' : ''}`} />
                {isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductDetails;