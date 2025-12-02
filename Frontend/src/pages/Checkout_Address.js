import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card, Form, Modal } from "react-bootstrap";
import "../styles/Checkout-Address.css"; // We will update this file

// --- Helper Functions (unchanged) ---
const formatCurrency = (v) => `$${Number(v).toFixed(2)}`;
const estimatedDelivery = (daysFromNow = 9) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// --- Initial Data (unchanged) ---
const initialAddresses = [
  {
    name: "Huzefa Bagwala",
    label: "HOME",
    address: "1131 Dusty Townline, Jacksonville, TX 40322",
    contact: "(+936) 361-0310",
  },
  {
    name: "IndiaTech",
    label: "OFFICE",
    address: "1219 Harvest Path, Jacksonville, TX 40326",
    contact: "(+936) 361-0310",
  },
];

const emptyAddress = {
  name: "",
  label: "HOME",
  address: "",
  contact: "",
};

export default function CheckoutAddress() {
  const location = useLocation();
  const navigate = useNavigate();
  const passedCart = (location.state && location.state.cartItems) || [];
  
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // --- Modal State ---
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(emptyAddress);

  // --- Cart Calculations (unchanged) ---
  const price = passedCart.length
    ? passedCart.reduce((s, i) => s + i.price * i.quantity, 0)
    : 319.98;
  const discount = price * 0.1;
  const total = price - discount;

  // --- Address Functions (Refactored) ---
  const removeAddress = (idx) => {
    // A real app would have a confirmation modal, but for now, we'll just remove.
    setAddresses((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (selectedIdx >= next.length) {
        setSelectedIdx(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  const handleShowEditModal = (idx) => {
    setIsEditing(true);
    setCurrentAddress(addresses[idx]);
    setShowModal(true);
  };

  const handleShowAddModal = () => {
    setIsEditing(false);
    setCurrentAddress(emptyAddress);
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  const handleModalSave = () => {
    if (isEditing) {
      // Edit existing address
      setAddresses((prev) =>
        prev.map((addr, idx) =>
          idx === selectedIdx ? currentAddress : addr
        )
      );
    } else {
      // Add new address
      setAddresses((prev) => [...prev, currentAddress]);
      setSelectedIdx(addresses.length); // Auto-select the new address
    }
    setShowModal(false);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setCurrentAddress((prev) => ({ ...prev, [name]: value }));
  };

  // --- Render ---
  return (
    <>
      <Container className="checkout-container my-5">
        <Row>
          {/* --- Left Column: Address --- */}
          <Col lg={8}>
            <div className="steps-container">
              <span className="step-active">Address</span>
              <span className_name="step">Shipping</span>
              <span className="step">Payment</span>
            </div>
            
            <h3 className="mt-4 mb-3">Select Delivery Address</h3>

            {addresses.map((addr, idx) => (
              <Card className="address-box mb-3" key={idx}>
                <Card.Body>
                  <Form.Check
                    type="radio"
                    id={`addr-${idx}`}
                    name="address"
                    checked={selectedIdx === idx}
                    onChange={() => setSelectedIdx(idx)}
                    label={
                      <div className="address-details">
                        <h4>
                          {addr.name} <span className="tag">{addr.label}</span>
                        </h4>
                        <p>{addr.address}</p>
                        <p className="contact">Contact: {addr.contact}</p>
                      </div>
                    }
                  />
                  <div className="edit-remove-btns">
                    <Button variant="link" size="sm" onClick={() => handleShowEditModal(idx)}>Edit</Button>
                    <span>|</span>
                    <Button variant="link" size="sm" className="text-danger" onClick={() => removeAddress(idx)}>Remove</Button>
                  </div>
                </Card.Body>
              </Card>
            ))}

            <Button variant="outline-primary" onClick={handleShowAddModal}>
              + Add New Address
            </Button>
          </Col>

          {/* --- Right Column: Order Summary --- */}
          <Col lg={4}>
            {/* This is styled just like the CartPage summary for consistency */}
            <aside className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-line">
                <span>Price</span>
                <span>{formatCurrency(price)}</span>
              </div>
              <div className="summary-line">
                <span>Discount</span>
                <span>− {formatCurrency(discount)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span className="free-shipping">Free</span>
              </div>
              <div className="summary-line">
                <span>Coupon Applied</span>
                <span>{formatCurrency(0)}</span>
              </div>
              <hr />
              <div className="summary-total">
                <span>TOTAL</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <p className="delivery-date">
                Estimated Delivery by <strong>{estimatedDelivery()}</strong>
              </p>
              <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Coupon Code" />
              </Form.Group>
              <Button
                variant="warning"
                className="w-100 checkout-btn"
                onClick={() => navigate("/shipping")} // You'll need to create this page
              >
                Continue to Shipping
              </Button>
              <Button
                variant="outline-secondary"
                className="w-100 mt-2"
                onClick={() => navigate("/cart")}
              >
                Back to Cart
              </Button>
            </aside>
          </Col>
        </Row>
      </Container>

      {/* --- Address Add/Edit Modal --- */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Address" : "Add New Address"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentAddress.name}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Label (e.g., HOME, OFFICE)</Form.Label>
              <Form.Control
                type="text"
                name="label"
                value={currentAddress.label}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={currentAddress.address}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control
                type="text"
                name="contact"
                value={currentAddress.contact}
                onChange={handleModalChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}