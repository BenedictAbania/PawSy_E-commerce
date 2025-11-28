import React from "react";
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

            {/* --- FIX 3: Make Heart Icon a Link to Wishlist & Add Badge --- */}
            <Link to="/wishlist" className="nav-icon position-relative">
              <FontAwesomeIcon icon={faHeartRegular} /> 
              {/* Show badge only if count > 0 */}
              {favoritesCount > 0 && (
                <Badge pill bg="danger" className="wishlist-badge">
                  {favoritesCount}
                </Badge>
              )}
            </Link>

            {/* Account Icon (already correct) */}
            <Link to="/account" className="nav-icon position-relative">
              <FontAwesomeIcon icon={faUser} />
            </Link>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;