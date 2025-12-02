import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Form, Modal, Image, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import '../styles/Payment.css'; // We will create this next

// --- Helper Functions (from your other files for consistency) ---
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

// --- Initial Data (from their HTML) ---
const initialPaymentMethods = [
  {
    id: 1,
    type: "Visa",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
    lastFour: "6754",
    expiry: "06/21",
  },
  {
    id: 2,
    type: "Mastercard",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    lastFour: "5643",
    expiry: "11/25",
  },
];

const emptyCard = { type: "Visa", cardName: "", cardNumber: "", expiryDate: "" };

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  // const { cartItems, totals } = location.state || {}; // Get data from previous page
  
  // --- Mock totals (in case you navigate directly) ---
  const mockTotals = { subtotal: 319.98, discount: 31.9, finalTotal: 288.08 };
  // const subtotal = totals?.subtotal || mockTotals.subtotal;
  // const discount = totals?.discount || mockTotals.discount;
  const [finalTotal, setFinalTotal] = useState(mockTotals.finalTotal);
  
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [selectedId, setSelectedId] = useState(1);
  const [couponCode, setCouponCode] = useState("");

  // --- Modal State (just like in Checkout_Address.js) ---
  const [showModal, setShowModal] = useState(false);
  const [newCard, setNewCard] = useState(emptyCard);
  
  // --- Handlers ---
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => {
    setNewCard(emptyCard);
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setNewCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSave = () => {
    // Basic validation
    if (!newCard.cardName || !newCard.cardNumber || !newCard.expiryDate) {
      alert("Please fill in all fields."); // Replaced with a real modal in a real app
      return;
    }
    
    const [year, month] = newCard.expiryDate.split("-");
    
    const newMethod = {
      id: Date.now(),
      type: newCard.type,
      logo: newCard.type === "Visa" ? "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" : "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
      lastFour: newCard.cardNumber.slice(-4),
      expiry: `${month}/${year.slice(-2)}`,
    };

    setPaymentMethods((prev) => [...prev, newMethod]);
    setSelectedId(newMethod.id);
    setShowModal(false);
  };

  const removePaymentMethod = (e, id) => {
    e.stopPropagation(); // Prevent the radio button from being selected
    setPaymentMethods((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "PETLOVER10") {
      setFinalTotal(mockTotals.finalTotal * 0.9);
      // In a real app, you'd show a success message
    } else {
      // In a real app, you'd show an error
    }
  };

  const handlePlaceOrder = () => {
    // Logic to submit the order...
    // alert("Order placed!"); // Replaced with navigation
    navigate("/confirmation"); // You'll need to create this page
  };

  return (
    <>
      <Container className="payment-container my-5">
        <Row>
          {/* --- Left Column: Payment --- */}
          <Col lg={8}>
            {/* --- Progress Steps (Unified) --- */}
            <div className="steps-container">
              <span className="step" onClick={() => navigate("/checkout")}>Address</span>
              <span className="step-separator">&gt;</span>
              <span className="step" onClick={() => navigate("/shipping")}>Shipping</span>
              <span className="step-separator">&gt;</span>
              <span className="step-active">Payment</span>
            </div>
            
            <h3 className="mt-4 mb-3">Payment Method</h3>

            {paymentMethods.map((method) => (
              <Card 
                className={`payment-card mb-3 ${selectedId === method.id ? 'selected' : ''}`} 
                key={method.id} 
                onClick={() => setSelectedId(method.id)}
              >
                <Card.Body>
                  <Form.Check
                    type="radio"
                    id={`payment-${method.id}`}
                    name="payment"
                    checked={selectedId === method.id}
                    onChange={() => setSelectedId(method.id)}
                    label={
                      <div className="payment-details">
                        <Image src={method.logo} alt={method.type} className="card-logo" />
                        <span className="card-info">{method.type} •••• {method.lastFour}</span>
                        <span className="card-expiry">Expires {method.expiry}</span>
                      </div>
                    }
                  />
                  <Button 
                    variant="link" 
                    className="remove-btn" 
                    onClick={(e) => removePaymentMethod(e, method.id)}
                  >
                    Remove
                  </Button>
                </Card.Body>
              </Card>
            ))}

            <Button variant="outline-primary" onClick={handleModalShow}>
              + Add Payment Method
            </Button>
          </Col>

          {/* --- Right Column: Order Summary --- */}
          <Col lg={4}>
            {/* --- Re-using the same order summary component for consistency --- */}
            <aside className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-line">
                <span>Price</span>
                <span>{formatCurrency(mockTotals.subtotal)}</span>
              </div>
              <div className="summary-line">
                <span>Discount</span>
                <span>− {formatCurrency(mockTotals.discount)}</span>
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
                <span>{formatCurrency(finalTotal)}</span>
              </div>
              <p className="delivery-date">
                Estimated Delivery by <strong>{estimatedDelivery()}</strong>
              </p>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button variant="outline-secondary" onClick={handleApplyCoupon}>
                  <FontAwesomeIcon icon={faTag} />
                </Button>
              </InputGroup>
              <Button
                variant="warning"
                className="w-100 checkout-btn"
                onClick={handlePlaceOrder}
              >
                Place Your Order and Pay
              </Button>
            </aside>
          </Col>
        </Row>
      </Container>

      {/* --- Add Payment Method Modal (Unified) --- */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Card Type</Form.Label>
              <Form.Select name="type" value={newCard.type} onChange={handleModalChange}>
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
                <option value="American Express">American Express</option>
                <option value="GCash">GCash</option>
                <option value="PayMaya">PayMaya</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                type="text"
                name="cardName"
                placeholder="Enter cardholder name"
                value={newCard.cardName}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                name="cardNumber"
                placeholder="Enter card number"
                value={newCard.cardNumber}
                onChange={handleModalChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="month"
                name="expiryDate"
                value={newCard.expiryDate}
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
            Add Card
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}