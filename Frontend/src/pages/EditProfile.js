import React, { useState, useEffect } from "react";
import "../styles/EditProfile.css";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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
        const userData = data.user || data;
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else if (response.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        navigate('/login');
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate password change if attempting it
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        setError('Please enter your current password to change it.');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match.');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('New password must be at least 6 characters long.');
        return;
      }
      if (formData.newPassword === formData.currentPassword) {
        setError('New password must be different from current password.');
        return;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('authToken');
      
      // Prepare update data
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      };

      // Add password fields only if user is changing password
      if (formData.currentPassword && formData.newPassword) {
        updateData.current_password = formData.currentPassword;
        updateData.password = formData.newPassword;
        updateData.password_confirmation = formData.confirmPassword;
      }

      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        // Update local storage with new user data
        localStorage.setItem('currentUser', JSON.stringify(data));
        
        // Dispatch event for other components to update
        window.dispatchEvent(new Event('profileUpdated'));
        
        alert('Profile updated successfully!');
        navigate('/my-profile');
      } else {
        // Handle validation errors from backend
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join('\n');
          setError(errorMessages);
        } else if (data.message) {
          setError(data.message);
        } else {
          setError('Failed to update profile. Please try again.');
        }
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone and you will need to sign up again.')) {
      return;
    }

    // Second confirmation for critical action
    if (!window.confirm('This is your last warning. Your account and all data will be permanently deleted. Continue?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Clear all auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        
        // Dispatch logout event
        window.dispatchEvent(new Event('authUpdated'));
        
        alert('Account deleted successfully. You have been logged out.');
        navigate('/');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete account. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('Network error. Please check your connection and try again.');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="account-page py-5">
      <div className="container d-flex justify-content-center">
        <div className="edit-card">
          <h3 className="edit-title">Edit Your Profile</h3>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)}
                aria-label="Close"
              ></button>
            </div>
          )}

          <form onSubmit={handleSaveChanges}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Full Name *</label>
                <input
                  className="form-control form-control-custom"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Email *</label>
                <input
                  className="form-control form-control-custom"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Phone</label>
                <input
                  className="form-control form-control-custom"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Address</label>
                <input
                  className="form-control form-control-custom"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </div>
            </div>

            <div className="password-section mt-4">
              <label className="form-label">Password Changes (Optional)</label>
              <p className="text-muted small mb-3">Leave blank if you don't want to change your password</p>
              <input
                className="form-control form-control-custom mb-3"
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Current Password"
              />
              <input
                className="form-control form-control-custom mb-3"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New Password (min 6 characters)"
              />
              <input
                className="form-control form-control-custom mb-3"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm New Password"
              />
            </div>

            <div className="d-flex gap-3 justify-content-end align-items-center mt-4">
              <Link to="/my-profile" className="btn btn-cancel">
                Cancel
              </Link>
              <Button 
                className="btn btn-save" 
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-5 pt-4 border-top">
            <h5 className="text-danger">Danger Zone</h5>
            <p className="text-muted small">Once you delete your account, there is no going back. Please be certain.</p>
            <Button 
              className="btn btn-danger" 
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditProfile;