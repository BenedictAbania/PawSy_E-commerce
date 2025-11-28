import React, { useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// Use the main product data source
import productsData from '../data/products.json';
// Import the unified Product Card (assuming it's in components)
import ProductCard from '../components/ProductCard';
import '../styles/Wishlist.css'; // We'll create this next

// Receive global favorites and the toggle function as props
const Wishlist = ({ favorites, onToggleFavorite }) => {
  const navigate = useNavigate();

  // Filter the main product list to find only the favorited items
  // Note: 'favorites' is now an array of product *objects*
  const wishlistItems = productsData.filter(product =>
    favorites.some(fav => fav.id === product.id)
  );

  // --- Alert State (Consistent with Shop/ProductList) ---
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [alertProduct, setAlertProduct] = useState("");

  // Handler for Add to Cart button on the cards
  const handleAddToCart = (product) => {
    console.log("Added to cart from wishlist:", product.name);
    setAlertProduct(product.name);
    setShowCartAlert(true);
    setTimeout(() => {
      setShowCartAlert(false);
    }, 3000);
    // Add to global cart state here in a real app
  };

  // Handler for "Move All To Cart" button (placeholder functionality)
  const moveAllToCart = () => {
    console.log("Moving all items to cart:", wishlistItems);
    alert("All wishlist items moved to cart! (Functionality pending)");
    // In a real app, loop through wishlistItems and call the global add-to-cart function for each
  };

  return (
    <Container className="wishlist-container my-5">
      {/* --- Floating Cart Alert --- */}
      <Alert
        variant="success"
        show={showCartAlert}
        onClose={() => setShowCartAlert(false)}
        dismissible
        className="cart-alert" // Re-use the same style
      >
        Added <strong>{alertProduct}</strong> to your cart!
      </Alert>

      {/* --- Wishlist Header --- */}
      <div className="wishlist-header">
        <h1>Wishlist ({wishlistItems.length})</h1>
        {/* Show "Move All" button only if there are items */}
        {wishlistItems.length > 0 && (
          <Button variant="warning" onClick={moveAllToCart} className="move-all-btn">
            Move All To Cart
          </Button>
        )}
      </div>

      {/* --- Wishlist Items Grid --- */}
      {wishlistItems.length > 0 ? (
        <Row>
          {wishlistItems.map((product) => (
            // Use responsive columns, matching Shop/ProductList
            <Col lg={3} md={4} sm={6} xs={12} key={product.id} className="mb-4 d-flex align-items-stretch">
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                // Check if the item ID exists in the favorites array
                isFavorite={favorites.some(fav => fav.id === product.id)}
                // Pass the global toggle function down, wrapped
                onToggleFavorite={() => onToggleFavorite(product)}
              />
            </Col>
          ))}
        </Row>
      ) : (
        // Message displayed when the wishlist is empty
        <Row>
           <Col>
             <p className="text-center text-muted mt-4">Your wishlist is empty. Add items by clicking the heart icon!</p>
             <div className="text-center">
                <Button variant="outline-secondary" onClick={() => navigate('/shop')}>Go Shopping</Button>
             </div>
           </Col>
        </Row>
      )}
    </Container>
  );
};

export default Wishlist;