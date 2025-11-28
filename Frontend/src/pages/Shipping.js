import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import '../styles/Shipping.css'; // We will create this next

// --- Helper Functions (for consistency) ---
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

export default function Shipping() {
  const location = useLocation();
  const navigate = useNavigate();
  // const { cartItems, totals } = location.state || {}; // Get data from previous page

  // --- Mock totals (in case you navigate directly) ---
  const mockTotals = { subtotal: 319.98, discount: 31.9, finalTotal: 288.08 };
  // const subtotal = totals?.subtotal || mockTotals.subtotal;
  // const discount = totals?.discount || mockTotals.discount;
  const [finalTotal, setFinalTotal] = useState(mockTotals.finalTotal);
  
  const [selectedShipping, setSelectedShipping] = useState("free");
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "PETLOVER10") {
      setFinalTotal(mockTotals.finalTotal * 0.9);
    }
  };

  return (
    <>
      <Container className="shipping-container my-5">
        <Row>
          {/* --- Left Column: Shipping Options --- */}
          <Col lg={8}>
            {/* --- Progress Steps (Unified) --- */}
            <div className="steps-container">
              <span className="step" onClick={() => navigate("/checkout")}>Address</span>
              <span className="step-separator">&gt;</span>
              <span className="step-active">Shipping</span>
              <span className="step-separator">&gt;</span>
              <span className="step" onClick={() => navigate("/payment")}>Payment</span>
            </div>
            
            <h3 className="mt-4 mb-3">Shipment Method</h3>

            {/* --- Shipping Option 1: Free --- */}
            <Card 
              className={`shipping-option-card mb-3 ${selectedShipping === 'free' ? 'selected' : ''}`} 
              onClick={() => setSelectedShipping('free')}
            >
              <Card.Body>
                <Form.Check
                  type="radio"
                  id="shipping-free"
                  name="shipping"
                  checked={selectedShipping === 'free'}
                  onChange={() => setSelectedShipping('free')}
                  label={
                    <div className="shipping-details">
                      <strong>Free</strong> Regular Shipment
                    </div>
                  }
                />
                <span className="shipping-date">01 Feb, 2023</span>
              </Card.Body>
            </Card>

            {/* --- Shipping Option 2: Priority --- */}
            <Card 
              className={`shipping-option-card mb-3 ${selectedShipping === 'priority' ? 'selected' : ''}`} 
              onClick={() => setSelectedShipping('priority')}
            >
              <Card.Body>
                <Form.Check
                  type="radio"
                  id="shipping-priority"
                  name="shipping"
                  checked={selectedShipping === 'priority'}
                  onChange={() => setSelectedShipping('priority')}
                  label={
                    <div className="shipping-details">
                      <strong>$8.50</strong> Priority Shipping
                    </div>
                  }
                />
                <span className="shipping-date">28 Jan, 2023</span>
              </Card.Body>
            </Card>

            {/* --- Shipping Option 3: Schedule --- */}
            <Card 
              className={`shipping-option-card mb-3 ${selectedShipping === 'schedule' ? 'selected' : ''}`} 
              onClick={() => setSelectedShipping('schedule')}
            >
              <Card.Body>
                <Form.Check
                  type="radio"
                  id="shipping-schedule"
                  name="shipping"
                  checked={selectedShipping === 'schedule'}
                  onChange={() => setSelectedShipping('schedule')}
                  label={
                    <div className="shipping-details">
                      <strong>Schedule</strong> Choose a date that works for you.
                    </div>
                  }
                />
                <span className="shipping-date select-date">Select Date</span>
              </Card.Body>
            </Card>

          </Col>

          {/* --- Right Column: Order Summary (UNIFIED) --- */}
          <Col lg={4}>
            {/* --- This is the *exact same* JSX as the other pages --- */}
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
                onClick={() => navigate("/payment")}
              >
                Continue to Payment
              </Button>
            </aside>
          </Col>
        </Row>
      </Container>
    </>
  );
}
