import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/MyProfile.css'; 

const MyProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL from your Laravel backend
  const API_BASE_URL = 'http://localhost:8083/api';

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user || data); // Handle different response structures
        setError(null);
      } else if (response.status === 401) {
        // Unauthorized - token expired or invalid
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        navigate('/login');
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile. Please try again.');
      // Optionally redirect to login after error
      setTimeout(() => navigate('/login'), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchUserProfile();
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger mt-5" role="alert">
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container">
      <header>
        <nav className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/account">My Account</Link>
        </nav>
      </header>

      <main className="account-container">
        <aside className="sidebar">
          <nav className="account-nav">
            <div className="nav-section">
              <strong>Manage My Account</strong>
              <ul>
                <li className="active"><Link to="/account">My Profile</Link></li>
                <li><Link to="/my-payment-options">My Payment Options</Link></li>
              </ul>
            </div>
            <div className="nav-section">
              <strong>My Orders</strong>
              <ul>
                <li><Link to="/returns">My Returns</Link></li>
                <li><Link to="/cancellations">My Cancellations</Link></li>
                <li><Link to="/track-orders">Track Orders</Link></li>
              </ul>
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
                    src={user.profile_photo || user.profilePhoto || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name || user.fullName || 'User') + "&size=200&background=FF6B35&color=fff"} 
                    alt="Profile" 
                    onError={(e) => {
                      e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name || user.fullName || 'User') + "&size=200&background=FF6B35&color=fff";
                    }}
                  />
                </div>
                <button className="change-photo-btn" onClick={() => alert('Photo upload feature coming soon!')}>
                  Change Photo
                </button>
              </div>
              <div className="profile-info">
                <div className="info-row">
                  <span className="label">Full Name</span>
                  <span className="value">{user.name || user.fullName || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Phone Number</span>
                  <span className="value">{user.phone || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email Address</span>
                  <span className="value">{user.email || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Address</span>
                  <span className="value">
                    {user.address || 'Not provided'}
                  </span>
                </div>
    
                <div className="info-row">
                  <span className="label">Member Since</span>
                  <span className="value">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="button-container">
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