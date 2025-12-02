import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import '../styles/TrackOrders.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Images (Make sure paths are correct based on your folder structure)
import dogFood from '../assets/assets/dog-food-removebg-preview.png';
import dewormer from '../assets/assets/nematocide-removebg-preview.png';
import catFood from '../assets/assets/cat-food-removebg-preview.png';

const TrackOrders = () => {
  return (
    <div className="container">
      <header>
        <nav className="breadcrumb">
           {/* Linked to Home and Account */}
          <Link to="/">Home</Link> / <Link to="/account">My Account</Link>
        </nav>
      </header>

      <main className="account-container">
        <aside className="sidebar">
          <nav className="account-nav">
            <div className="nav-section">
              <strong>Manage My Account</strong>
              <ul>
                {/* Link back to My Profile */}
                <li><Link to="/account">My Profile</Link></li>
                <li><Link to="/payment">My Payment Options</Link></li>
              </ul>
            </div>
            <div className="nav-section">
              <strong>My Orders</strong>
              <ul>
                <li><Link to="/returns">My Returns</Link></li>
                <li><Link to="/cancellations">My Cancellations</Link></li>
                {/* Active class retained. Link points to current page */}
                <li className="active"><Link to="/track-orders">Track Orders</Link></li>
              </ul>
            </div>
            <div className="nav-section">
              <strong>My Wishlist</strong>
            </div>
          </nav>
        </aside>

        <section className="main-content">
          <div className="order-card">
            <div className="order-header">
              <div className="order-id">Order ID: OD45345345435</div>
            </div>

            <div className="order-info">
              <div className="info-item">
                <strong>Estimated Delivery Time:</strong>
                <div>December 10, 2025</div>
              </div>
              <div className="info-item">
                <strong>Shipping by:</strong>
                <div>BLUEDART, +1598675986</div>
              </div>
              <div className="info-item">
                <strong>Status:</strong>
                <div>Picked by the courier</div>
              </div>
              <div className="info-item">
                <strong>Tracking #:</strong>
                <div>BD045903594059</div>
              </div>
            </div>

            <div className="tracking-steps">
              <div className="step active">
                <div className="step-icon">
                  <i className="fas fa-check"></i>
                </div>
                <div className="step-text">Order confirmed</div>
              </div>
              <div className="step active">
                <div className="step-icon">
                  <i className="fas fa-user"></i>
                </div>
                <div className="step-text">Picked by courier</div>
              </div>
              <div className="step">
                <div className="step-icon">
                  <i className="fas fa-truck"></i>
                </div>
                <div className="step-text">On the way</div>
              </div>
              <div className="step">
                <div className="step-icon">
                  <i className="fas fa-box"></i>
                </div>
                <div className="step-text">Delivered</div>
              </div>
            </div>

            <div className="products-grid">
              <div className="product-card">
                <div className="product-image">
                  <img src={dogFood} alt="Dog Food" />
                </div>
                <div className="product-info">
                  <div className="product-title">Premium Dog Food</div>
                  <div className="product-price">$19.99</div>
                </div>
              </div>
              <div className="product-card">
                <div className="product-image">
                  <img src={dewormer} alt="Dewormer" />
                </div>
                <div className="product-info">
                  <div className="product-title">Dewormer-Dematocide</div>
                  <div className="product-price">$19.99</div>
                </div>
              </div>
              <div className="product-card">
                <div className="product-image">
                  <img src={catFood} alt="Cat Food" />
                </div>
                <div className="product-info">
                  <div className="product-title">Premium Cat Food</div>
                  <div className="product-price">$650</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TrackOrders;