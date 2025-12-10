import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import '../styles/TrackOrders.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// --- IMPORTS FOR LAYOUT ---
// (We assume these are now handled by App.js layout, so keeping imports minimal or removed if handled globally)

// Base URL for your backend images
const IMAGE_BASE_URL = 'http://localhost:8083';

const TrackOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- Rating Modal State ---
  const [showRateModal, setShowRateModal] = useState(false);
  const [ratingProduct, setRatingProduct] = useState(null); // The item being rated
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:8083/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Failed to fetch orders');

        const data = await response.json();
        
        // Filter out Cancelled/Returned from this specific view if desired
        const activeOrders = data.filter(order => 
            order.status !== 'cancelled' && order.status !== 'returned'
        );
        setOrders(activeOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // --- Handlers ---

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8083/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error("Failed to cancel order");
      alert("Order cancelled successfully!");
      setOrders(orders.filter(order => order.id !== orderId)); // Remove from view
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleReturnOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to return this order?")) return;
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:8083/api/orders/${orderId}/return`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error("Failed to return order");
      alert("Return requested successfully!");
      setOrders(orders.filter(order => order.id !== orderId)); // Remove from view
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // --- Rating Logic ---
  const openRateModal = (item) => {
    setRatingProduct(item);
    setRatingValue(5);
    setRatingComment("");
    setShowRateModal(true);
  };

  const submitRating = async () => {
    if (!ratingProduct) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch('http://localhost:8083/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          product_id: ratingProduct.product_id, // Ensure your order items have product_id
          rating: ratingValue,
          comment: ratingComment
        })
      });

      if (!response.ok) throw new Error("Failed to submit review");

      alert("Thank you for your review!");
      setShowRateModal(false);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Helper functions
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const getImageUrl = (path) => path?.startsWith('http') ? path : `${IMAGE_BASE_URL}${path}`;
  
  const getStepStatus = (orderStatus, stepName) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIdx = steps.indexOf(orderStatus) === -1 ? 0 : steps.indexOf(orderStatus);
    const stepIdx = steps.indexOf(stepName);
    return currentIdx >= stepIdx ? 'active' : '';
  };

  if (loading) return <div className="text-center my-5"><Spinner animation="border" variant="warning" /></div>;
  if (error) return <div className="text-center my-5 text-danger">Error: {error}</div>;

  return (
    <>
      <div className="container" style={{ marginTop: '20px', marginBottom: '50px' }}>
        <header className="mb-4">
          <nav className="breadcrumb">
            <Link to="/">Home</Link> / <Link to="/account">My Account</Link> / Track Orders
          </nav>
        </header>

        <main className="account-container">
          <aside className="sidebar">
            <nav className="account-nav">
              <div className="nav-section">
                <strong>Manage My Account</strong>
                <ul>
                  <li><Link to="/my-profile">My Profile</Link></li>
                  <li><Link to="/my-payment-options">My Payment Options</Link></li>
                </ul>
              </div>
              <div className="nav-section">
                <strong>My Orders</strong>
                <ul>
                  <li><Link to="/returns">My Returns</Link></li>
                  <li><Link to="/cancellations">My Cancellations</Link></li>
                  <li className="active"><Link to="/track-orders">Track Orders</Link></li>
                </ul>
              </div>
            </nav>
          </aside>

          <section className="main-content">
            {orders.length === 0 ? (
              <Alert variant="info">You haven't placed any orders yet.</Alert>
            ) : (
              orders.map((order) => (
                <div className="order-card" key={order.id}>
                  <div className="order-header d-flex justify-content-between align-items-center">
                    <div>
                      <div className="order-id">Order ID: #{order.id}</div>
                      <div className="order-date text-muted">Placed on: {formatDate(order.created_at)}</div>
                    </div>

                    <div className="d-flex gap-2">
                      {order.status === 'pending' && (
                        <Button variant="outline-danger" size="sm" onClick={() => handleCancelOrder(order.id)}>
                          Cancel Order
                        </Button>
                      )}
                      {order.status === 'delivered' && (
                        <Button variant="outline-warning" size="sm" onClick={() => handleReturnOrder(order.id)}>
                          Return Item
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* ... Info Section & Progress Bar (Keep existing code) ... */}
                  <div className="order-info">
                    <div className="info-item"><strong>Status:</strong> <span className="text-capitalize">{order.status}</span></div>
                    <div className="info-item"><strong>Total:</strong> ${Number(order.total_price).toFixed(2)}</div>
                  </div>

                   {/* Tracking Progress Bar */}
                   <div className="tracking-steps">
                    <div className={`step ${getStepStatus(order.status, 'pending')}`}>
                      <div className="step-icon"><i className="fas fa-check"></i></div>
                      <div className="step-text">Order confirmed</div>
                    </div>
                    <div className={`step ${getStepStatus(order.status, 'processing')}`}>
                      <div className="step-icon"><i className="fas fa-user"></i></div>
                      <div className="step-text">Processing</div>
                    </div>
                    <div className={`step ${getStepStatus(order.status, 'shipped')}`}>
                      <div className="step-icon"><i className="fas fa-truck"></i></div>
                      <div className="step-text">On the way</div>
                    </div>
                    <div className={`step ${getStepStatus(order.status, 'delivered')}`}>
                      <div className="step-icon"><i className="fas fa-box"></i></div>
                      <div className="step-text">Delivered</div>
                    </div>
                  </div>

                  {/* Ordered Products List */}
                  <div className="products-grid">
                    {order.items && order.items.map((item) => (
                      <div className="product-card" key={item.id} style={{position: 'relative'}}>
                        <div className="product-image">
                          <img 
                            src={getImageUrl(item.product?.image)} 
                            alt={item.product?.name || "Product"} 
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100?text=No+Image'; }}
                          />
                        </div>
                        <div className="product-info">
                          <div className="product-title">{item.product?.name || "Unknown Item"}</div>
                          <div className="product-qty text-muted">Qty: {item.quantity}</div>
                          
                          {/* RATE BUTTON: Only visible if order is Delivered */}
                          {order.status === 'delivered' && (
                             <Button 
                                variant="link" 
                                className="p-0 text-warning text-decoration-none mt-1"
                                style={{fontSize: '0.9rem'}}
                                onClick={() => openRateModal(item)}
                             >
                                <FontAwesomeIcon icon={faStar} /> Rate Product
                             </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </section>
        </main>
      </div>

      {/* --- RATING MODAL --- */}
      <Modal show={showRateModal} onHide={() => setShowRateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Rate Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <h5>{ratingProduct?.product?.name}</h5>
            <div className="fs-3 text-warning" style={{cursor: 'pointer'}}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon 
                  key={star} 
                  icon={star <= ratingValue ? faStar : faStarRegular} 
                  onClick={() => setRatingValue(star)}
                  className="mx-1"
                />
              ))}
            </div>
          </div>
          <Form.Group>
            <Form.Label>Write a review (optional)</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              placeholder="What did you like about this product?"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRateModal(false)}>Cancel</Button>
          <Button variant="warning" onClick={submitRating}>Submit Review</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TrackOrders;