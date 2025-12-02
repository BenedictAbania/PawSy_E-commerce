import React, { useState, useEffect } from "react";
import "../styles/Account.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        setUser(JSON.parse(raw));
      } else {
        // Not logged in - redirect to login
        navigate('/login');
      }
    } catch (e) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Listen for auth updates
  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem('currentUser');
        setUser(raw ? JSON.parse(raw) : null);
      } catch (e) {}
    };
    window.addEventListener('authUpdated', handler);
    return () => window.removeEventListener('authUpdated', handler);
  }, []);

  if (loading) return <div className="container py-5 text-center">Loading...</div>;
  if (!user) return null;

  return (
    <>
      <section className="account-page py-5">
        <div className="container">
          {/* located at the upper left this section */}
          <p className="account-header text-left mb-4">
            <Link to="/home">Home</Link>
          </p>
          <p className="account-header text-left mb-4">/&nbsp;My Account</p>
        </div>

        <div className="container">
          <div className="profile-card p-4 bg-white rounded shadow-sm">
            <h2 className="text-center profile-page-title mb-4">My Profile</h2>
            <div className="row align-items-center">
              <div className="col-md-4 text-center mb-4 mb-md-0">
                <div className="profile-image position-relative mx-auto">
                  <div className="profile-image-placeholder d-flex align-items-center justify-content-center">
                    {user.fullName?.charAt(0).toUpperCase() || 'P'}
                  </div>
                  <button className="camera-btn btn btn-sm">
                    <FontAwesomeIcon icon={faCamera} />
                  </button>
                </div>
              </div>

              <div className="col-md-8">
                <div className="profile-info">
                  <div className="mb-3">
                    <div className="info-label">Full Name</div>
                    <div className="info-value">{user.fullName || 'N/A'}</div>
                  </div>

                  <div className="mb-3">
                    <div className="info-label">Phone Number</div>
                    <div className="info-value">{user.phone || '(Not provided)'}</div>
                  </div>

                  <div className="mb-3">
                    <div className="info-label">Email Address</div>
                    <div className="info-value">{user.email || 'N/A'}</div>
                  </div>

                  <div className="mb-3">
                    <div className="info-label">Address</div>
                    <div className="info-value">
                      {user.address || '(Not provided)'}
                    </div>
                  </div>

                  <div className="text-md-right mt-3">
                    <Link to="/edit-profile" className="btn-edit">
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Account;
