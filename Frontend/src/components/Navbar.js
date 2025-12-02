import React, { useState, useEffect } from "react";
// --- ADD Badge ---
import { Navbar, Nav, Container, Form, FormControl, Button, Badge } from "react-bootstrap"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faMagnifyingGlass, faCartShopping, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'; // Use solid heart
import { faHeart as faHeartRegular, faUser } from '@fortawesome/free-regular-svg-icons';
import { Link } from "react-router-dom"; // Link is already imported
import "../styles/Navbar.css";
import Logo from "../assets/icon-logo.png";

// --- Accept favoritesCount as a prop ---
const NavBar = ({ favoritesCount = 0 }) => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      // ignore
    }
  }, []);

  // listen for in-tab auth updates
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

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setOpen(false);
    try { window.dispatchEvent(new Event('authUpdated')); } catch (e) {}
    // navigate to home by link click; using window.location is fine here
    window.location.href = '/';
  };

  return (
    <Navbar expand="lg" className="main-navbar">
      <Container>
        {/* --- FIX 1: Use as={Link} and to="/" --- */}
        <Navbar.Brand as={Link} to="/" className="brand-logo"> 
          <img src={Logo} alt="PawSy" className="icon-logo" />
          PawSy
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            {/* --- FIX 2: Use as={Link} and to="..." for all Nav Links --- */}
            <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link>
            <Nav.Link as={Link} to="/shop" className="nav-link-custom">Shop</Nav.Link>
            <Nav.Link as={Link} to="/aboutUs" className="nav-link-custom">About Us</Nav.Link>
            <Nav.Link as={Link} to="/contact" className="nav-link-custom">Contact Us</Nav.Link>
          </Nav>
          <Form className="d-flex align-items-center search-form">
            <FormControl type="search" placeholder="Search products..." className="search-input"/>
            <Button variant="dark" className="search-btn"><FontAwesomeIcon icon={faMagnifyingGlass} /></Button>
          </Form>
          <div className="nav-icons">
            {/* Cart Icon (already correct) */}
            <Link to="/cart" className="nav-icon position-relative">
              <FontAwesomeIcon icon={faCartShopping} />
              {/* Optional: Add cart count badge later */}
            </Link>

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="nav-icon position-relative">
              <FontAwesomeIcon icon={faHeartRegular} />
              {favoritesCount > 0 && (
                <Badge pill bg="danger" className="wishlist-badge">
                  {favoritesCount}
                </Badge>
              )}
            </Link>

            {/* Account Icon - shows login link or profile dropdown when logged in */}
            {user ? (
              <div className="nav-icon position-relative profile-menu">
                <div onClick={() => setOpen(!open)} style={{ cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faUser} />
                </div>
                {open && (
                  <div className="profile-dropdown">
                    <div className="profile-name">{user.fullName}</div>
                    <div className="profile-email">{user.email}</div>
                    <div className="profile-actions">
                      <Link to="/my-profile" onClick={() => setOpen(false)}>MyProfile</Link>
                      <button className="logout-btn" onClick={handleLogout}>Logout</button>
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
  );
};

export default NavBar;