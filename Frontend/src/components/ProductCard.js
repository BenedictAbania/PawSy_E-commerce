import React, { useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarEmpty,
  faHeart as faHeartRegular,
} from "@fortawesome/free-regular-svg-icons";
import "../styles/ProductCard.css";

// Helper component for star ratings (reusable)
const StarRating = ({ rating = 0, reviewCount }) => {
  const numRating = Number(rating) || 0; // Ensure it's a number
  const stars = [];
  const fullStars = Math.floor(numRating);
  const halfStar = numRating % 1 >= 0.5;
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
    ? `${numRating.toFixed(1)} / 5.0 (${reviewCount})`
    : `${numRating.toFixed(1)}`;

  return (
    <div className="star-rating">
      {stars} <span className="rating-value text-muted ms-1" style={{ fontSize: '0.8rem' }}>{ratingText}</span>
    </div>
  );
};

const ProductCard = ({
  product,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
}) => {
  // --- FIX: Handle both React naming and Laravel naming ---
  const {
    id = "N/A",
    name = "Product Name",
    category = "Category",
    price = 0,
    image = "https://placehold.co/400x400/FFF0E6/CCC?text=Image",
    // 1. Try standard props
    rating,
    reviewCount, 
    // 2. Try Laravel props (The Fix)
    reviews_avg_rating, 
    reviews_count
  } = product || {};

  // 3. Determine which one to use
  const effectiveRating = rating || reviews_avg_rating || 0;
  const effectiveCount = reviewCount || reviews_count || 0;

  // --- Loading State ---
  const [isAdding, setIsAdding] = useState(false);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    onToggleFavorite(product);
  };

  const handleCartClick = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    await onAddToCart(product);
    setIsAdding(false);
  };

  return (
    <Card className="h-100 product-card-unified border-0 shadow-sm">
      <Link to={`/shop/${id}`} className="product-card-link text-decoration-none">
        <div className="position-relative" style={{ height: '250px', overflow: 'hidden', padding: '20px', backgroundColor: '#f9f9f9' }}>
          <Card.Img
            variant="top"
            src={image}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/400x400/FFF0E6/CCC?text=Image+Not+Found";
            }}
          />
        </div>
      </Link>
      <Card.Body className="d-flex flex-column">
        {/* Added Category Label for consistency */}
        <div className="text-muted small mb-1 text-uppercase">{category}</div>

        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="product-card-title mb-0" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
            <Link to={`/shop/${id}`} className="product-card-link text-dark text-decoration-none">
              {name}
            </Link>
          </Card.Title>
          <Button
            variant="link"
            className="heart-btn p-0"
            onClick={handleFavoriteClick}
          >
            <FontAwesomeIcon
              icon={isFavorite ? faHeartSolid : faHeartRegular}
              className={isFavorite ? "text-danger" : "text-muted"}
            />
          </Button>
        </div>

        {/* --- USE THE FIXED VARIABLES HERE --- */}
        <StarRating rating={effectiveRating} reviewCount={effectiveCount} />

        <Card.Text className="h5 product-price my-2 text-primary fw-bold">
          ${Number(price).toFixed(2)}
        </Card.Text>

        <Button
          variant="warning"
          className="mt-auto add-to-cart-btn text-white fw-bold"
          onClick={handleCartClick}
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Adding...
            </>
          ) : (
            "Add to Cart"
          )}
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;