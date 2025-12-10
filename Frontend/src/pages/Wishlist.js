import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// Import the unified Product Card (assuming it's in components)
import ProductCard from '../components/ProductCard';
import { addToCart } from '../utils/cartHelper';
import '../styles/Wishlist.css'; // We'll create this next

const API_URL = 'http://localhost:8083/api/products';
const IMAGE_BASE_URL = 'http://localhost:8083';

// Receive global favorites and the toggle function as props
const Wishlist = ({ favorites, onToggleFavorite }) => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [alertProduct, setAlertProduct] = useState("");

  // Helper to format image URLs
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('data:')) return path;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/assets')) return path;
    return `${IMAGE_BASE_URL}${path}`;
  };

  // Fetch wishlist items from API
  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const allProducts = await response.json();
          // Filter to only items in favorites and format images
          const items = allProducts
            .filter(product => favorites.some(fav => fav.id === product.id))
            .map(product => ({
              ...product,
              image: getImageUrl(product.image)
            }));
          setWishlistItems(items);
        }
      } catch (err) {
        console.error('Error fetching wishlist items:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [favorites]);

  // Handler for Add to Cart button on the cards
  const handleAddToCart = async (product) => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const result = await addToCart(product, 1);
    setAlertProduct(result.message);
    setShowCartAlert(true);
    setTimeout(() => {
      setShowCartAlert(false);
    }, 3000);
  };

  // Handler for "Move All To Cart" button
  const moveAllToCart = async () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (wishlistItems.length === 0) return;

    for (const item of wishlistItems) {
      await addToCart(item, 1);
    }

    setAlertProduct(`All ${wishlistItems.length} items moved to cart!`);
    setShowCartAlert(true);
    setTimeout(() => setShowCartAlert(false), 3000);
  };

  if (loading) {
    return <Container className="my-5 text-center">Loading wishlist...</Container>;
  }

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