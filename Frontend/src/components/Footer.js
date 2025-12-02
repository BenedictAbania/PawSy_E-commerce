import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaw} from '@fortawesome/free-solid-svg-icons'
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md={4}>
            <h5 className="footer-logo"><FontAwesomeIcon icon={faPaw} /> PawSy PetCentral</h5>
            <p>
              Your trusted hub for all things pets. From food and toys to
              grooming and wellness, we provide quality products that help pets
              live happier and healthier.
            </p>
          </Col>
          <Col md={8}>
            <Row>
              <Col md={4}>
                <h6>Quick Links</h6>
                <ul>
                  <li>Home</li>
                  <li>Shop</li>
                  <li>Cart</li>
                  <li>Wishlist</li>
                  <li>Profile</li>
                </ul>
              </Col>
              <Col md={4}>
                <h6>Category</h6>
                <ul>
                  <li>Accessories</li>
                  <li>Furniture</li>
                  <li>Bag</li>
                  <li>Foods</li>
                </ul>
              </Col>
              <Col md={4}>
                <h6>Customer Service</h6>
                <ul>
                  <li>Contact Us</li>
                  <li>Shipping</li>
                  <li>Returns</li>
                  <li>Order Tracking</li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <div className="footer-bottom">
        <p>© 2025 PetCentral. Design by Group One.</p>
      </div>
    </footer>
  );
};

export default Footer;
