import React, { useState, useEffect } from "react";
// 1. ADDED Spinner to imports
import { Container, Row, Col, Button, Image, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/CartPage.css";

const API_URL = "http://localhost:8083/api/cart";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in and fetch cart from backend
  useEffect(() => {
    const checkAuthAndFetchCart = async () => {
      try {
        const user = localStorage.getItem('currentUser');
        if (!user) {
          setIsLoggedIn(false);
          const saved = localStorage.getItem("cartItems");
          setCartItems(saved ? JSON.parse(saved) : []);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(API_URL, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const items = data.items.map(item => ({
            id: item.product_id,
            product_id: item.product_id,
            cart_id: item.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            quantity: item.quantity
          }));
          setCartItems(items);
        } else if (response.status === 401) {
          const saved = localStorage.getItem("cartItems");
          setCartItems(saved ? JSON.parse(saved) : []);
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        const saved = localStorage.getItem("cartItems");
        setCartItems(saved ? JSON.parse(saved) : []);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndFetchCart();
  }, []);

  // Save to localStorage whenever cart changes (for backup)
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = async (productId, cartId, change) => {
    const item = cartItems.find(i => i.id === productId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    if (isLoggedIn && cartId) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/${cartId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ quantity: newQuantity })
        });

        if (!response.ok) {
          console.error('Failed to update cart on backend');
          setCartItems((prevItems) =>
            prevItems.map((i) =>
              i.id === productId ? { ...i, quantity: item.quantity } : i
            )
          );
        }
      } catch (err) {
        console.error('Error updating cart:', err);
      }
    }
  };

  const removeItem = async (productId, cartId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));

    if (isLoggedIn && cartId) {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_URL}/${cartId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          console.error('Failed to remove item from backend');
          const removedItem = cartItems.find(i => i.id === productId);
          if (removedItem) {
            setCartItems((prevItems) => [...prevItems, removedItem]);
          }
        }
      } catch (err) {
        console.error('Error removing item:', err);
      }
    }
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const discount = subtotal * 0.1;
    const finalTotal = subtotal - discount;
    return { subtotal, discount, finalTotal };
  };

  const totals = calculateTotals();

  // --- 2. ADDED LOADING STATE HERE ---
  if (loading) {
    return (
      <Container className="my-5 text-center py-5">
        <Spinner animation="border" variant="warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3 text-muted">Loading your cart...</p>
      </Container>
    );
  }

  return (
    <Container className="wishlist-container my-5">
      
      <div className="wishlist-header">
        <h1>Cart ({cartItems.length})</h1>
      </div>

      {cartItems.length === 0 ? (
        <Row>
          <Col className="text-center mt-4">
            <p className="text-muted">
              Your cart is empty. Add items by browsing the shop!
            </p>
            <Button
              variant="outline-secondary"
              onClick={() => navigate("/shop")}
            >
              Go Shopping
            </Button>
          </Col>
        </Row>
      ) : (
        <Row>
          <Col lg={8}>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <Row key={item.id} className="cart-item mb-4 pb-4">
                  <Col md={3}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>

                  <Col md={6} className="item-details">
                    <h4 className="item-name">{item.name}</h4>

                    <div className="quantity-control">
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.cart_id, -1)}
                      >
                        −
                      </Button>

                      <span className="quantity-value">{item.quantity}</span>

                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.cart_id, 1)}
                      >
                        +
                      </Button>
                    </div>

                    <Button
                      variant="link"
                      className="remove-btn"
                      onClick={() => removeItem(item.id, item.cart_id)}
                    >
                      Remove
                    </Button>
                  </Col>

                  <Col md={3} className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Col>
                </Row>
              ))}
            </div>
          </Col>

          <Col lg={4}>
            <aside className="order-summary">
              <h3>Order Summary</h3>

              <div className="summary-line">
                <span>Price</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>

              <div className="summary-line">
                <span>Discount</span>
                <span>− ${totals.discount.toFixed(2)}</span>
              </div>

              <div className="summary-line">
                <span>Shipping</span>
                <span className="free-shipping">Free</span>
              </div>

              <hr />

              <div className="summary-total">
                <span>Total</span>
                <span>${totals.finalTotal.toFixed(2)}</span>
              </div>

              <Button
                variant="warning"
                className="w-100 checkout-btn mt-3"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </aside>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default CartPage;