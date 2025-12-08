import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card, Form, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import CheckoutSteps from '../components/CheckoutSteps'; // <--- Added Import
import "../styles/Shipping.css";

const formatCurrency = (v) => `$${Number(v || 0).toFixed(2)}`;

const estimatedDelivery = (daysFromNow = 5) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

// Shipping rules: threshold + location-based rates
const SHIPPING_RULES = {
  metro_manila: {
    freeStandardMinSubtotal: 50,
    rates: { standard: 5, priority: 12, schedule: 8 },
    etaDays: { standard: 3, priority: 1, schedule: 2 },
  },
  provincial: {
    freeStandardMinSubtotal: 80,
    rates: { standard: 9, priority: 18, schedule: 14 },
    etaDays: { standard: 6, priority: 3, schedule: 4 },
  },
  international: {
    freeStandardMinSubtotal: Infinity,
    rates: { standard: 35, priority: 65, schedule: 0 }, // schedule not available
    etaDays: { standard: 14, priority: 7, schedule: 0 },
  },
};

export default function Shipping() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    const saved = localStorage.getItem("cartItems");
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  // Keep displaying the saved address
  const shippingAddress = localStorage.getItem("shippingAddress") || "";

  const [shippingLocation, setShippingLocation] = useState(
    localStorage.getItem("shippingLocation") || "metro_manila"
  );
  const [selectedShipping, setSelectedShipping] = useState(
    localStorage.getItem("shippingMethod") || "standard"
  );

  useEffect(() => {
    localStorage.setItem("shippingLocation", shippingLocation);
  }, [shippingLocation]);

  useEffect(() => {
    localStorage.setItem("shippingMethod", selectedShipping);
  }, [selectedShipping]);

  const [couponCode, setCouponCode] = useState("");
  const discount = 0;

  const subtotal = cartItems.reduce(
    (s, i) => s + Number(i.price || 0) * Number(i.quantity || 0),
    0
  );

  const rule = SHIPPING_RULES[shippingLocation] || SHIPPING_RULES.metro_manila;

  const shippingCost = useMemo(() => {
    if (shippingLocation === "international" && selectedShipping === "schedule") return null;

    if (
      selectedShipping === "standard" &&
      subtotal >= rule.freeStandardMinSubtotal &&
      shippingLocation !== "international"
    ) {
      return 0;
    }

    return rule.rates[selectedShipping] ?? 0;
  }, [selectedShipping, subtotal, rule, shippingLocation]);

  const total = subtotal - discount + (shippingCost ?? 0);

  const handleContinue = () => {
    if (!shippingAddress) {
      alert("No delivery address found. Please go back and select an address.");
      return navigate("/checkout");
    }
    if (shippingCost === null) {
      alert("Scheduled delivery is not available for International shipping. Please choose another method.");
      return;
    }

    localStorage.setItem("shippingCost", String(shippingCost));
    localStorage.setItem("shippingMethod", selectedShipping);
    localStorage.setItem("shippingLocation", shippingLocation);

    navigate("/payment");
  };

  return (
    <Container className="my-5">
      {/* 1. Added Checkout Steps */}
      <CheckoutSteps activeStep="shipping" />

      <Row>
        <Col lg={8}>
          <h3 className="mb-3">Shipment Method</h3>

          {/* Address display */}
          <Card className="mb-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-muted small">Deliver to</div>
                  <div style={{ fontWeight: 600 }}>
                    {shippingAddress || "No address selected yet."}
                  </div>
                </div>
                <Button variant="link" className="p-0" onClick={() => navigate("/checkout")}>
                  Change
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Location selector (manual) */}
          <Card className="mb-3">
            <Card.Body>
              <Form.Group>
                <Form.Label className="mb-2">Delivery Location</Form.Label>
                <Form.Select
                  value={shippingLocation}
                  onChange={(e) => setShippingLocation(e.target.value)}
                >
                  <option value="metro_manila">Metro Manila</option>
                  <option value="provincial">Provincial</option>
                  <option value="international">International</option>
                </Form.Select>

                <div className="text-muted small mt-2">
                  Standard is free over{" "}
                  <strong>
                    {shippingLocation === "international"
                      ? "N/A"
                      : formatCurrency(rule.freeStandardMinSubtotal)}
                  </strong>
                </div>
              </Form.Group>
            </Card.Body>
          </Card>

          {/* Standard */}
          <Card
            className={`shipping-option-card mb-3 ${selectedShipping === "standard" ? "selected" : ""}`}
            onClick={() => setSelectedShipping("standard")}
          >
            <Card.Body>
              <Form.Check
                type="radio"
                name="shipping"
                checked={selectedShipping === "standard"}
                onChange={() => setSelectedShipping("standard")}
                label={
                  <div className="shipping-details">
                    <strong>
                      Standard Delivery{" "}
                      {shippingLocation !== "international" && subtotal >= rule.freeStandardMinSubtotal
                        ? "(Free)"
                        : `(${formatCurrency(rule.rates.standard)})`}
                    </strong>
                    <div className="text-muted small">Delivered by {estimatedDelivery(rule.etaDays.standard)}</div>
                  </div>
                }
              />
            </Card.Body>
          </Card>

          {/* Priority */}
          <Card
            className={`shipping-option-card mb-3 ${selectedShipping === "priority" ? "selected" : ""}`}
            onClick={() => setSelectedShipping("priority")}
          >
            <Card.Body>
              <Form.Check
                type="radio"
                name="shipping"
                checked={selectedShipping === "priority"}
                onChange={() => setSelectedShipping("priority")}
                label={
                  <div className="shipping-details">
                    <strong>Fast Delivery ({formatCurrency(rule.rates.priority)})</strong>
                    <div className="text-muted small">Delivered by {estimatedDelivery(rule.etaDays.priority)}</div>
                  </div>
                }
              />
            </Card.Body>
          </Card>

          {/* Scheduled */}
          <Card
            className={`shipping-option-card mb-3 ${selectedShipping === "schedule" ? "selected" : ""}`}
            onClick={() => setSelectedShipping("schedule")}
          >
            <Card.Body>
              <Form.Check
                type="radio"
                name="shipping"
                checked={selectedShipping === "schedule"}
                onChange={() => setSelectedShipping("schedule")}
                disabled={shippingLocation === "international"}
                label={
                  <div className="shipping-details">
                    <strong>
                      Scheduled Delivery{" "}
                      {shippingLocation === "international"
                        ? "(Not available internationally)"
                        : `(${formatCurrency(rule.rates.schedule)})`}
                    </strong>
                    <div className="text-muted small">
                      {shippingLocation === "international"
                        ? "Please choose Standard or Fast"
                        : `Delivered by ${estimatedDelivery(rule.etaDays.schedule)}`}
                    </div>
                  </div>
                }
              />
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* 2. Updated Summary Styling to match Address Page */}
          <aside className="order-summary p-4 bg-white rounded shadow-sm border">
            <h4 className="mb-4">Order Summary</h4>

            <div className="summary-line d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="summary-line d-flex justify-content-between mb-2">
              <span>Discount</span>
              <span>− {formatCurrency(discount)}</span>
            </div>

            <div className="summary-line d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span>
                {shippingCost === null
                  ? <span className="text-danger">Unavailable</span>
                  : shippingCost === 0
                    ? <span className="free-shipping text-success">Free</span>
                    : formatCurrency(shippingCost)}
              </span>
            </div>

            <hr />
            <div className="summary-total d-flex justify-content-between mb-4 fw-bold fs-5">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>

            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button variant="outline-secondary">
                <FontAwesomeIcon icon={faTag} />
              </Button>
            </InputGroup>

            <Button variant="warning" className="w-100 checkout-btn fw-bold text-white" onClick={handleContinue}>
              Continue to Payment
            </Button>
          </aside>
        </Col>
      </Row>
    </Container>
  );
}