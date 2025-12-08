import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner, Alert, Button } from 'react-bootstrap';
import '../styles/MyCancellations.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const IMAGE_BASE_URL = 'http://localhost:8083';

const MyCancellations = () => {
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        
        // FILTER: Only keep orders where status is 'cancelled'
        const cancelled = data.filter(order => order.status === 'cancelled');
        setCancelledOrders(cancelled);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://placehold.co/100?text=No+Image';
    if (path.startsWith('http')) return path;
    return `${IMAGE_BASE_URL}${path}`;
  };

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>;
  if (error) return <div className="text-center my-5 text-danger">Error: {error}</div>;

  return (
      <div className="container" style={{ marginTop: '20px', marginBottom: '50px' }}>
        <header className="mb-4">
          <nav className="breadcrumb">
            <Link to="/">Home</Link> / <Link to="/account">My Account</Link> / Cancellations
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
                  {/* Active Class Here */}
                  <li className="active"><Link to="/cancellations">My Cancellations</Link></li>
                  <li><Link to="/track-orders">Track Orders</Link></li>
                </ul>
              </div>
            </nav>
          </aside>

          <section className="main-content">
            <h4 className="mb-4">Cancelled Orders</h4>

            {cancelledOrders.length === 0 ? (
              <Alert variant="info">You have no cancelled orders.</Alert>
            ) : (
              cancelledOrders.map((order) => (
                <div className="order-card" key={order.id} style={{opacity: 0.9}}> 
                  <div className="order-header bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <div className="order-id text-danger">Order ID: #{order.id} (Cancelled)</div>
                      <div className="order-date text-muted">Placed on: {formatDate(order.created_at)}</div>
                    </div>
                    {/* Re-order Button */}
                    <Button variant="outline-primary" size="sm" onClick={() => navigate(`/shop`)}>
                      Buy Again
                    </Button>
                  </div>

                  <div className="order-info">
                    <div className="info-item">
                      <strong>Total Refund:</strong>
                      <div>${Number(order.total_price).toFixed(2)}</div>
                    </div>
                    <div className="info-item">
                      <strong>Original Payment:</strong>
                      <div className="text-uppercase">{order.payment_method}</div>
                    </div>
                  </div>

                  <div className="products-grid mt-3">
                    {order.items && order.items.map((item) => (
                      <div className="product-card" key={item.id}>
                        <div className="product-image">
                          <img 
                            src={getImageUrl(item.product?.image)} 
                            alt={item.product?.name} 
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100?text=No+Image'; }}
                          />
                        </div>
                        <div className="product-info">
                          <div className="product-title">{item.product?.name}</div>
                          <div className="product-qty text-muted">Qty: {item.quantity}</div>
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
  );
};

export default MyCancellations;