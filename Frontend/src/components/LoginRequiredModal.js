import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginRequiredModal.css';

const LoginRequiredModal = ({ product, onClose, action = 'addToCart' }) => {
  const navigate = useNavigate();

  const getMessageText = () => {
    if (action === 'addToWishlist') {
      return 'You need to log in or sign up to add items to your wishlist.';
    }
    return 'You need to log in or sign up to add items to your cart.';
  };

  const handleLogin = () => {
    // Store the callback so it can be triggered after login
    localStorage.setItem('postLoginCallback', JSON.stringify({ 
      action, 
      data: { product } 
    }));
    navigate('/login');
  };

  const handleSignup = () => {
    // Store the callback so it can be triggered after signup
    localStorage.setItem('postLoginCallback', JSON.stringify({ 
      action, 
      data: { product } 
    }));
    navigate('/signup');
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Login Required</h2>
        <p>{getMessageText()}</p>
        <div className="modal-buttons">
          <button className="btn-signup" onClick={handleSignup}>
            Sign Up
          </button>
          <button className="btn-login" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
