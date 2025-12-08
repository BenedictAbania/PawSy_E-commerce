import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Form,
  FormControl,
  Button,
  Badge,
  Modal, // Added Modal for logout confirmation
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// --- KEEPING ORIGINAL ICON IMPORTS ---
import {
  faPaw,
  faMagnifyingGlass,
  faCartShopping,
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as faHeartRegular,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
// -------------------------------------

import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import "../styles/Navbar.css";
import Logo from "../assets/icon-logo.png";

const NavBar = ({ favoritesCount = 0, cartCount = 0 }) => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  // --- NEW STATES ---
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  // listen for in-tab auth updates
  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem("currentUser");
        setUser(raw ? JSON.parse(raw) : null);
      } catch (e) {}
    };
    window.addEventListener("authUpdated", handler);
    return () => window.removeEventListener("authUpdated", handler);
  }, []);

  // --- MODIFIED: Handle Logout Click (Open Modal) ---
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setOpen(false); // Close the dropdown
  };

  // --- NEW: Actual Logout Logic ---
  const confirmLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("authToken");
    setUser(null);
    setShowLogoutModal(false);

    // Notify app
    try {
      window.dispatchEvent(new Event("authUpdated"));
    } catch (e) {}

    // Redirect to login or home
    navigate("/login");
  };

  // --- NEW: Search Handler ---
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate("/shop");
    }
  };

  return (
    <>
      <Navbar expand="lg" className="main-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-logo">
            <img src={Logo} alt="PawSy" className="icon-logo" />
            PawSy
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link as={Link} to="/" className="nav-link-custom">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/shop" className="nav-link-custom">
                Shop
              </Nav.Link>
              <Nav.Link as={Link} to="/aboutUs" className="nav-link-custom">
                About Us
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="nav-link-custom">
                Contact Us
              </Nav.Link>
            </Nav>

            {/* --- MODIFIED: Search Form --- */}
            <Form
              className="d-flex align-items-center search-form"
              onSubmit={handleSearch}
            >
              <FormControl
                type="search"
                placeholder="Search products..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="dark" type="submit" className="search-btn">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Button>
            </Form>

            <div className="nav-icons">
              {/* Cart Icon */}
              <Link to="/cart" className="nav-icon position-relative">
                <FontAwesomeIcon icon={faCartShopping} />
                {cartCount > 0 && (
                  <Badge pill bg="warning" className="cart-badge">
                    {cartCount}
                  </Badge>
                )}
              </Link>

              {/* Wishlist Icon - Uses faHeartRegular (Outline) */}
              <Link to="/wishlist" className="nav-icon position-relative">
                <FontAwesomeIcon icon={faHeartRegular} />
                {favoritesCount > 0 && (
                  <Badge pill bg="danger" className="wishlist-badge">
                    {favoritesCount}
                  </Badge>
                )}
              </Link>

              {/* Account Icon - Uses faUser (Outline/Regular) */}
              {user ? (
                <div className="nav-icon position-relative profile-menu">
                  <div
                    onClick={() => setOpen(!open)}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  {open && (
                    <div className="profile-dropdown">
                      <div className="profile-name">
                        {user.fullName || user.name}
                      </div>
                      <div className="profile-email">{user.email}</div>
                      <div className="profile-actions">
                        <Link to="/my-profile" onClick={() => setOpen(false)}>
                          MyProfile
                        </Link>
                        {/* Modified Logout Button */}
                        <button
                          className="logout-btn"
                          onClick={handleLogoutClick}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="nav-icon position-relative">
                  <FontAwesomeIcon icon={faUser} />
                </Link>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* --- NEW: Logout Confirmation Modal --- */}
      <Modal
        show={showLogoutModal}
        onHide={() => setShowLogoutModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to log out of your account?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavBar;
