import React, { useState } from "react";
import "../styles/Login.css";
import sideImage from "../assets/Do Dogs and Cats Really Hate Each Other_.png";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8083/api";

function Signup() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // NEW STATES FOR VISIBILITY
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!terms) return alert("Please agree to the Terms & Policy.");
    if (password !== confirm) return alert("Passwords do not match.");

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", 
        "Accept": "application/json"
         },
        body: JSON.stringify({ name: fullname, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      try {
        window.dispatchEvent(new Event("authUpdated"));
      } catch (e) {}

      alert("Account created successfully!");
      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Shared Style for the toggle button
  const toggleBtnStyle = {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#f97316",
    fontWeight: "600",
    fontSize: "0.75rem",
    padding: "0",
  };

  return (
    <div className="main">
      <div className="left">
        <div className="login-box">
          <h1>Get Started Now!</h1>
          <p className="lead">
            Sign up to manage your profile, orders, and wishlist.
          </p>

          <form id="signupForm" onSubmit={handleSubmit}>
            <label htmlFor="fullname">Full name</label>
            <input
              id="fullname"
              type="text"
              placeholder="Enter your full name"
              required
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />

            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="row">
              <div className="col">
                <label htmlFor="password">Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"} // DYNAMIC
                    placeholder="Create password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={toggleBtnStyle}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div className="col">
                <label htmlFor="confirm">Confirm password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="confirm"
                    type={showConfirm ? "text" : "password"} // DYNAMIC
                    placeholder="Confirm password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    style={{ paddingRight: "40px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={toggleBtnStyle}
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            <div className="terms">
              <input
                id="terms"
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />
              <label htmlFor="terms">
                I agree to the{" "}
                <a href="#" style={{ color: "#f97316" }}>
                  Terms & Policy
                </a>
              </label>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>

            <div className="divider">or</div>
            <div className="social-login">
              <button type="button" className="social-btn">
                <img
                  src="https://img.icons8.com/color/24/000000/google-logo.png"
                  alt=""
                  style={{ height: "18px" }}
                />
                Sign up with Google
              </button>
              <button type="button" className="social-btn">
                <img
                  src="https://img.icons8.com/ios-filled/24/000000/mac-os.png"
                  alt=""
                  style={{ height: "18px" }}
                />
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
