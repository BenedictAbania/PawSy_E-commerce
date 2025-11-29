import React, { useState } from 'react';
import '../styles/Login.css';
import sideImage from '../assets/Do Dogs and Cats Really Hate Each Other_.png';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate against users in localStorage
    const raw = localStorage.getItem('users');
    const users = raw ? JSON.parse(raw) : [];
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      alert('Invalid credentials. Please check your email and password.');
      return;
    }
    // set current user
    localStorage.setItem('currentUser', JSON.stringify(user));
    // notify other components in this tab
    try { window.dispatchEvent(new Event('authUpdated')); } catch (e) {}
    
    // Check for post-login callback
    const callbackRaw = localStorage.getItem('postLoginCallback');
    localStorage.removeItem('postLoginCallback');
    
    alert('Login successful');
    
    if (callbackRaw) {
      try {
        const callback = JSON.parse(callbackRaw);
        // If there's a callback, execute it and stay on this page momentarily
        if (callback.action === 'addToCart') {
          // Add to cart first, then navigate back
          if (callback.data && callback.data.product) {
            const cartRaw = localStorage.getItem('cart') || '[]';
            const cart = JSON.parse(cartRaw);
            const existingItem = cart.find(item => item.id === callback.data.product.id);
            if (existingItem) {
              existingItem.quantity += 1;
            } else {
              cart.push({ ...callback.data.product, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
          }
          // Navigate back to the previous page or landing
          navigate(-1);
        } else {
          navigate('/');
        }
      } catch (e) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="main">
      <div className="left">
        <div className="login-box">
          <h1>Welcome back!</h1>
          <p>Enter your credentials to access your account.</p>
          <form id="loginForm" onSubmit={handleSubmit}>
            <label>Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <div className="password-field">
              <label>Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <a href="#" className="forgot">Forgot password?</a>
            </div>
            <div className="remember">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
              <label htmlFor="remember">Remember for 30 days</label>
            </div>
            <button type="submit" className="login-btn">Login</button>
            <div className="divider">or</div>
            <div className="social-login">
              <button type="button" className="social-btn">
                <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google" /> Sign up with Google
              </button>
              <button type="button" className="social-btn">
                <img src="https://img.icons8.com/ios-filled/24/000000/mac-os.png" alt="Apple" /> Sign up with Apple
              </button>
            </div>
            <p className="signup">Don’t have an account? <Link to="/signup">Sign Up</Link></p>
          </form>
        </div>
      </div>
      <div className="right">
        <img src={sideImage} alt="Dogs and cats" className="side-image" />
      </div>
    </div>
  );
}

export default Login;
