import React from "react";
import { Card, Button } from "react-bootstrap";
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
  const numRating = Number(rating); // Ensure it's a number
  const stars = [];
  const fullStars = Math.floor(numRating);
  const halfStar = numRating % 1 >= 0.5;
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

  const ratingText = reviewCount
    ? `${numRating.toFixed(1)} / 5.0 (${reviewCount})`
    : `${numRating.toFixed(1)}`;

  return (
    <div className="star-rating">
      {stars} <span className="rating-value"> {ratingText}</span>
    </div>
  );
};

const ProductCard = ({
  product,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
}) => {
  const {
    id = "N/A",
    name = "Product Name",
    category = "Category",
    price = 0, // Default to 0
    rating = 0,
    reviewCount,
    image = "https://placehold.co/400x400/FFF0E6/CCC?text=Image",
  } = product || {};

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    onToggleFavorite(product);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    onAddToCart(product);
  };

  return (
    <Card className="h-100 product-card-unified">
      <Link to={`/shop/${id}`} className="product-card-link">
        <Card.Img
          variant="top"
          src={image}
          alt={name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/400x400/FFF0E6/CCC?text=Image+Not+Found";
          }}
        />
      </Link>
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="product-card-title mb-0">
            <Link to={`/shop/${id}`} className="product-card-link">
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
            />
          </Button>
        </div>

        <StarRating rating={rating} reviewCount={reviewCount} />

        {/* FIX: Ensure price is a Number before calling toFixed */}
        <Card.Text className="h5 product-price my-2">
          ${Number(price).toFixed(2)}
        </Card.Text>

        <Button
          variant="warning"
          className="mt-auto add-to-cart-btn"
          onClick={handleCartClick}
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
