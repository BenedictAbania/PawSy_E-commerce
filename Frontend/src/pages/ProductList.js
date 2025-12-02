import React, { useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
// Import the unified Product Card (assuming it's in components)
import ProductCard from '../components/ProductCard'; 
import '../styles/ProductList.css'; // We'll create this next

// --- Sample Data (Using data similar to Shop.js for consistency) ---
// In a real app, this might come from an API endpoint for a specific category
const sampleProducts = [
  {
    id: 1,
    name: "Jinx Dog Food",
    category: "Dog Food",
    price: 149.99,
    rating: 4.6, 
    reviewCount: 556, // Added review count
    image: "https://i.imgur.com/2iG7h8V.png" 
  },
  {
    id: 2,
    name: "Jinx Biscuits", 
    category: "Dog Treats",
    price: 169.99, // Updated price
    rating: 4.4, 
    reviewCount: 342, // Added review count
    image: "https://i.imgur.com/dEUM9VJ.png" 
  },
  { // Added another product for variety
    id: 3,
    name: "Premium Cat Tower",
    category: "Cat Furniture",
    price: 89.50,
    rating: 4.0,
    reviewCount: 120,
    image: "https://placehold.co/400x400/f5f5f5/c4c4c4?text=Cat+Tower", 
  }
];

// Receive global state/functions if lifted, otherwise use local
const ProductList = ({ favorites: globalFavorites, onToggleFavorite: globalToggleFavorite }) => {
  // --- State Management (Mirrors Shop.js) ---
  const [products, setProducts] = useState(sampleProducts);
  
  // Use local state if global state isn't provided
  const [localFavorites, setLocalFavorites] = useState([]);
  const favorites = globalFavorites !== undefined ? globalFavorites : localFavorites;
  const setFavorites = globalFavorites !== undefined ? () => {} : setLocalFavorites; 

  // Use local toggle if global function isn't provided
  const localToggleFavorite = (product) => { 
    const id = product.id;
    setFavorites((prev) =>
      prev.find(item => item.id === id) 
        ? prev.filter((item) => item.id !== id) 
        : [...prev, product] 
    );
  };
  const onToggleFavorite = globalToggleFavorite || localToggleFavorite;

  // Alert State
  const [showCartAlert, setShowCartAlert] = useState(false);
  const [alertProduct, setAlertProduct] = useState("");

  // Handler for Add to Cart
  const handleAddToCart = (product) => {
    console.log("Added to cart:", product.name);
    setAlertProduct(product.name);
    setShowCartAlert(true);
    setTimeout(() => {
      setShowCartAlert(false);
    }, 3000);
    // Add to global cart state here in a real app
  };

  return (
    <Container className="product-list-container my-5">
      {/* --- Floating Cart Alert --- */}
      <Alert 
        variant="success"
        show={showCartAlert}
        onClose={() => setShowCartAlert(false)}
        dismissible
        className="cart-alert" // Re-use style from other pages
      >
        Added <strong>{alertProduct}</strong> to your cart!
      </Alert>
      
      <h2 className="text-center mb-4">Our Products</h2>

      {/* --- UNIFIED GRID: Using Row/Col --- */}
      <Row>
        {products.length > 0 ? (
          products.map(product => (
            // Responsive columns: 4 on lg, 3 on md, 2 on sm, 1 on xs
            <Col lg={3} md={4} sm={6} xs={12} key={product.id} className="mb-4 d-flex align-items-stretch"> 
              <ProductCard 
                product={product} 
                onAddToCart={handleAddToCart}
                // Check if the product ID exists in the favorites array
                isFavorite={favorites.some(fav => fav.id === product.id)} 
                // Pass the toggle function down
                onToggleFavorite={onToggleFavorite} 
              />
            </Col>
          ))
        ) : (
          <Col><p className="text-center">No products available.</p></Col> 
        )}
      </Row>
    </Container>
  );
};

export default ProductList;