import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty, faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import '../styles/ProductCard.css'; // We'll create this next

// Helper component for star ratings (reusable)
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
  // Display review count if available
  const ratingText = reviewCount ? `${rating.toFixed(1)} / 5.0 (${reviewCount})` : `${rating.toFixed(1)}`;
  
  return (
    <div className="star-rating">
      {stars} <span className="rating-value"> {ratingText}</span>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart, isFavorite, onToggleFavorite }) => {
  // Use default values to prevent errors if product data is incomplete
  const { 
    id = 'N/A', 
    name = 'Product Name', 
    category = 'Category', 
    price = 0.00, 
    rating = 0, 
    reviewCount, // Optional review count
    image = 'https://placehold.co/400x400/FFF0E6/CCC?text=Image' // Placeholder
  } = product || {}; // Handle case where product prop might be null/undefined

  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Prevent link navigation when clicking heart
    onToggleFavorite(product);
  };

  const handleCartClick = (e) => {
     e.preventDefault(); // Prevent link navigation when clicking cart button
     onAddToCart(product);
  };


  return (
    <Card className="h-100 product-card-unified">
      {/* Link wraps the image and title for navigation */}
      <Link to={`/shop/${id}`} className="product-card-link">
        <Card.Img 
          variant="top" 
          src={image} 
          alt={name}
          // Fallback image if the provided image fails to load
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/FFF0E6/CCC?text=Image+Not+Found'; }}
        />
      </Link>
      <Card.Body className="d-flex flex-column">
        {/* Title and Heart button */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="product-card-title mb-0">
            <Link to={`/shop/${id}`} className="product-card-link">
              {name}
            </Link>
          </Card.Title>
          <Button
            variant="link"
            className="heart-btn p-0"
            onClick={handleFavoriteClick} // Use the specific handler
          >
            <FontAwesomeIcon icon={isFavorite ? faHeartSolid : faHeartRegular} />
          </Button>
        </div>

        {/* Rating */}
        <StarRating rating={rating} reviewCount={reviewCount} /> 
        
        {/* Price */}
        <Card.Text className="h5 product-price my-2">
          ${price.toFixed(2)}
        </Card.Text>
        
        {/* Add to Cart Button (at the bottom) */}
        <Button 
          variant="warning" // Uses Bootstrap 'warning' for orange, styled in CSS
          className="mt-auto add-to-cart-btn"
          onClick={handleCartClick} // Use the specific handler
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;