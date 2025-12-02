
import React, { useState } from 'react';
import '../styles/Login.css';
import sideImage from '../assets/Do Dogs and Cats Really Hate Each Other_.png';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!terms) {
      alert('Please agree to the Terms & Policy.');
      return;
    }
    if (password !== confirm) {
      alert('Passwords do not match.');
      return;
    }
    // Save user to localStorage (simple demo auth)
    const raw = localStorage.getItem('users');
    const users = raw ? JSON.parse(raw) : [];
    // prevent duplicate emails
    if (users.find(u => u.email === email)) {
      alert('An account with this email already exists. Please login.');
      return;
    }
    const newUser = { fullName: fullname, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login after signup
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    try { window.dispatchEvent(new Event('authUpdated')); } catch (e) {}
    
    // Check for post-login callback
    const callbackRaw = localStorage.getItem('postLoginCallback');
    localStorage.removeItem('postLoginCallback');
    
    alert('Account created successfully!');
    
    if (callbackRaw) {
      try {
        const callback = JSON.parse(callbackRaw);
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
          // Navigate back to the previous page
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
          <h1>Get Started Now!</h1>
          <p className="lead">Sign up to manage your profile, orders, and wishlist.</p>

          <form id="signupForm" onSubmit={handleSubmit}>
            <label htmlFor="fullname">Full name</label>
            <input id="fullname" type="text" placeholder="Enter your full name" required value={fullname} onChange={e => setFullname(e.target.value)} />

            <label htmlFor="email">Email address</label>
            <input id="email" type="email" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)} />

            <div className="row">
              <div className="col">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" placeholder="Create password" required value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div className="col">
                <label htmlFor="confirm">Confirm password</label>
                <input id="confirm" type="password" placeholder="Confirm password" required value={confirm} onChange={e => setConfirm(e.target.value)} />
              </div>
            </div>

            <div className="terms">
              <input id="terms" type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} />
              <label htmlFor="terms">I agree to the <a href="#" style={{color:'#f97316'}}>Terms & Policy</a></label>
            </div>

            <button type="submit" className="login-btn">Create account</button>

            <div className="divider">or</div>

            <div className="social-login">
              <button type="button" className="social-btn">
                <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="" style={{height:'18px'}} />
                Sign up with Google
              </button>

              <button type="button" className="social-btn">
                <img src="https://img.icons8.com/ios-filled/24/000000/mac-os.png" alt="" style={{height:'18px'}} />
                Sign up with Apple
              </button>
            </div>

            <p className="signup">
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </form>
        </div>
      </div>

      <div className="right">
        <img src={sideImage} alt="Dogs and cats" className="side-image" />
      </div>
    </div>
  );
}

export default Signup;
