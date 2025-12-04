import React, { useState } from "react";
import "../styles/Login.css";
import sideImage from "../assets/Do Dogs and Cats Really Hate Each Other_.png";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8083/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <--- NEW STATE
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      try {
        window.dispatchEvent(new Event("authUpdated"));
      } catch (e) {}

      alert("Login successful");

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        const callbackRaw = localStorage.getItem("postLoginCallback");
        localStorage.removeItem("postLoginCallback");

        if (callbackRaw) {
          navigate(-1);
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
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
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="password-field">
              <label>Password</label>
              {/* WRAPPER FOR POSITIONING */}
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"} // <--- DYNAMIC TYPE
                  id="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingRight: "50px" }} // Make room for button
                />
                {/* SHOW/HIDE BUTTON */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#f97316",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <a href="#" className="forgot">
                Forgot password?
              </a>
            </div>

            <div className="remember">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember">Remember for 30 days</label>
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="divider">or</div>
            <div className="social-login">
              <button type="button" className="social-btn">
                <img
                  src="https://img.icons8.com/color/24/000000/google-logo.png"
                  alt="Google"
                />{" "}
                Sign up with Google
              </button>
              <button type="button" className="social-btn">
                <img
                  src="https://img.icons8.com/ios-filled/24/000000/mac-os.png"
                  alt="Apple"
                />{" "}
                Sign up with Apple
              </button>
            </div>
            <p className="signup">
              Don’t have an account? <Link to="/signup">Sign Up</Link>
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

export default Login;
