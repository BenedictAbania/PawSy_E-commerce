import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import '../styles/MyProfile.css'; 

const MyProfile = () => {
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
                {/* Active class retained. Link points to /account (MyProfile) */}
                <li className="active"><Link to="/account">My Profile</Link></li>
                <li><Link to="/payment">My Payment Options</Link></li>
              </ul>
            </div>
            <div className="nav-section">
              <strong>My Orders</strong>
              <ul>
                <li><Link to="/returns">My Returns</Link></li>
                <li><Link to="/cancellations">My Cancellations</Link></li>
                {/* Link points to Track Orders page */}
                <li><Link to="/track-orders">Track Orders</Link></li>
              </ul>
            </div>
            <div className="nav-section">
              <strong>My Wishlist</strong>
            </div>
          </nav>
        </aside>

        <section className="profile-content">
          <div className="profile-card">
            <h1 className="page-title">My Profile</h1>
            <div className="profile-header">
              <div className="profile-photo-container">
                <div className="profile-photo">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80" 
                    alt="Profile" 
                  />
                </div>
                <button className="change-photo-btn">Change Photo</button>
              </div>
              <div className="profile-info">
                <div className="info-row">
                  <span className="label">Full Name</span>
                  <span className="value">Sarah Johnson</span>
                </div>
                <div className="info-row">
                  <span className="label">Phone Number</span>
                  <span className="value">(555) 123-4567</span>
                </div>
                <div className="info-row">
                  <span className="label">Email Address</span>
                  <span className="value">sarah.johnson@gmail.com</span>
                </div>
                <div className="info-row">
                  <span className="label">Address</span>
                  <span className="value">
                    123 Pet Lover Lane<br />
                    Cityville, State 12345
                  </span>
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="button-container">
              {/* Linked to Edit Profile */}
              <Link to="/edit-profile">
                <button className="edit-btn">Edit Profile</button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyProfile;