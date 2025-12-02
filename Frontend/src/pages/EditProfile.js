import React, { useState, useEffect } from "react";
import "../styles/EditProfile.css";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const EditProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        const userData = JSON.parse(raw);
        setUser(userData);
        setFormData(prev => ({
          ...prev,
          fullName: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || ''
        }));
      } else {
        navigate('/login');
      }
    } catch (e) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();

    // Validate password change if attempting it
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        alert('Please enter your current password to change it.');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        alert('New passwords do not match.');
        return;
      }
      if (formData.newPassword === formData.currentPassword) {
        alert('New password must be different from current password.');
        return;
      }
      // Verify current password
      if (formData.currentPassword !== user.password) {
        alert('Current password is incorrect.');
        return;
      }
    }

    // Prepare updated user object
    const updatedUser = {
      ...user,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address
    };

    // Update password if provided
    if (formData.newPassword) {
      updatedUser.password = formData.newPassword;
    }

    // Update currentUser
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update in users array
    const raw = localStorage.getItem('users');
    const users = raw ? JSON.parse(raw) : [];
    const index = users.findIndex(u => u.email === user.email);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }

    try { window.dispatchEvent(new Event('authUpdated')); } catch (e) {}
    alert('Profile updated successfully!');
    navigate('/account');
  };

  const handleDeleteAccount = () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone and you will need to sign up again.')) {
      return;
    }

    // Remove user from users array
    const raw = localStorage.getItem('users');
    const users = raw ? JSON.parse(raw) : [];
    const filteredUsers = users.filter(u => u.email !== user.email);
    localStorage.setItem('users', JSON.stringify(filteredUsers));

    // Remove currentUser
    localStorage.removeItem('currentUser');
    try { window.dispatchEvent(new Event('authUpdated')); } catch (e) {}

    alert('Account deleted successfully. You have been logged out.');
    navigate('/');
  };

  if (loading) return <div className="container py-5 text-center">Loading...</div>;
  if (!user) return null;

  return (
    <section className="account-page py-5">
      <div className="container d-flex justify-content-center">
        <div className="edit-card">
          <h3 className="edit-title">Edit Your Profile</h3>

          <form onSubmit={handleSaveChanges}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Full Name</label>
                <input
                  className="form-control form-control-custom"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control form-control-custom"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
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
                placeholder="New Password"
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
              <Link to="/account" className="btn btn-cancel">
                Cancel
              </Link>
              <Button className="btn btn-save" type="submit">
                Save Changes
              </Button>
            </div>
          </form>

          <div className="mt-5 pt-4 border-top">
            <h5 className="text-danger">Note:</h5>
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
