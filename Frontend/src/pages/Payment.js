import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  Modal,
  Image,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";
import "../styles/Payment.css";

const formatCurrency = (v) => `$${Number(v || 0).toFixed(2)}`;

// COD + sample cards 
const initialPaymentMethods = [
  {
    id: 1,
    type: "Cash on Delivery",
    logo: "https://cdn-icons-png.flaticon.com/512/2331/2331941.png",
    lastFour: "",
    expiry: "",
    code: "cod",
  },
  {
    id: 2,
    type: "Visa",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
    lastFour: "6754",
    expiry: "06/25",
    code: "visa",
  },
  {
    id: 3,
    type: "Mastercard",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    lastFour: "5643",
    expiry: "11/25",
    code: "mastercard",
  },
];

export default function Payment() {
  const navigate = useNavigate();

  // --- STATE ---
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCost, setShippingCost] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedId, setSelectedId] = useState(1); // default COD
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);

  // coupon UI (optional)
  const [couponCode, setCouponCode] = useState("");
  const discount = 0;

  // modal state (ADD ONLY)
  const [showModal, setShowModal] = useState(false);
  const [newCard, setNewCard] = useState({
    type: "Visa",
    cardName: "",
    cardNumber: "",
    expiryDate: "", // "YYYY-MM"
  });

  // --- LOAD DATA ---
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) setCartItems(JSON.parse(savedCart));

    const savedAddr = localStorage.getItem("shippingAddress");
    if (savedAddr) setShippingAddress(savedAddr);

    const savedShipCost = localStorage.getItem("shippingCost");
    if (savedShipCost) setShippingCost(Number(savedShipCost) || 0);

    const savedMethod = localStorage.getItem("shippingMethod");
    // optional: if you want to ensure user went through shipping
    // if (!savedMethod) navigate("/shipping");
  }, [navigate]);

  // --- TOTAL CALC ---
  const subtotal = cartItems.reduce(
    (s, i) => s + Number(i.price || 0) * Number(i.quantity || 0),
    0
  );
  const finalTotal = subtotal - discount + shippingCost;

  // --- PLACE ORDER ---
  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please login first");
      setIsSubmitting(false);
      navigate("/login");
      return;
    }

    if (!shippingAddress) {
      alert("No shipping address found. Please go back and select an address.");
      setIsSubmitting(false);
      navigate("/checkout");
      return;
    }

    const selectedMethod = paymentMethods.find((p) => p.id === selectedId);

    //
    const payload = {
      items: cartItems.map((item) => ({
        id: item.product_id ?? item.id, 
        quantity: Number(item.quantity || 0),
      })),
      total_price: Number(finalTotal.toFixed(2)),
      payment_method: selectedMethod?.code || "cod",
      shipping_address: shippingAddress,
    };

    try {
      const res = await fetch("http://localhost:8083/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order failed");

      // success
      localStorage.removeItem("cartItems");
      window.dispatchEvent(new Event("storage"));
      navigate("/track-orders");
    } catch (err) {
      alert("Error: " + err.message);
      setIsSubmitting(false);
    }
  };

  // --- MODAL (ADD ONLY) ---
  const handleModalClose = () => setShowModal(false);

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setNewCard((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSave = () => {
    // basic validation
    if (!newCard.cardName || !newCard.cardNumber || !newCard.expiryDate) {
      alert("Please complete all fields.");
      return;
    }

    const lastFour = (newCard.cardNumber || "").slice(-4);

    // Convert "YYYY-MM" -> "MM/YY"
    const [yyyy, mm] = newCard.expiryDate.split("-");
    const expiry = `${mm}/${yyyy.slice(-2)}`;

    const logo =
      newCard.type === "Visa"
        ? "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
        : "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg";

    const newMethod = {
      id: Date.now(),
      type: newCard.type,
      logo,
      lastFour,
      expiry,
      code: newCard.type.toLowerCase(),
      cardName: newCard.cardName, // optional display
    };

    setPaymentMethods((prev) => [...prev, newMethod]);
    setSelectedId(newMethod.id);

    // reset modal fields
    setNewCard({ type: "Visa", cardName: "", cardNumber: "", expiryDate: "" });
    setShowModal(false);
  };

  return (
    <Container className="payment-container my-5">
      <Row>
        <Col lg={8}>
          <div className="steps-container">
            <span className="step" onClick={() => navigate("/checkout")}>
              Address
            </span>
            <span className="step-separator">&gt;</span>
            <span className="step" onClick={() => navigate("/shipping")}>
              Shipping
            </span>
            <span className="step-separator">&gt;</span>
            <span className="step-active">Payment</span>
          </div>

          <h3 className="mt-4 mb-3">Payment Method</h3>

          {paymentMethods.map((method) => (
            <Card
              className={`payment-card mb-3 ${selectedId === method.id ? "selected" : ""}`}
              key={method.id}
              onClick={() => setSelectedId(method.id)}
            >
              <Card.Body>
                <Form.Check
                  type="radio"
                  name="payment"
                  checked={selectedId === method.id}
                  onChange={() => setSelectedId(method.id)}
                  label={
                    <div className="payment-details">
                      <Image
                        src={method.logo}
                        alt={method.type}
                        className="card-logo"
                        style={{ width: "40px" }}
                      />
                      <span className="card-info fw-bold">{method.type}</span>
                      {method.lastFour && (
                        <span className="card-info text-muted mx-2">•••• {method.lastFour}</span>
                      )}
                      {method.expiry && (
                        <span className="card-info text-muted mx-2">Exp {method.expiry}</span>
                      )}
                    </div>
                  }
                />
              </Card.Body>
            </Card>
          ))}

          <Button variant="outline-primary" onClick={() => setShowModal(true)}>
            + Add Payment Method
          </Button>
        </Col>

        <Col lg={4}>
          <aside className="order-summary">
            <h3>Order Summary</h3>

            <div className="summary-line">
              <span>Price</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="summary-line">
              <span>Discount</span>
              <span>− {formatCurrency(discount)}</span>
            </div>

            <div className="summary-line">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span>
            </div>

            <hr />

            <div className="summary-total">
              <span>TOTAL</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>

            {/* Keep coupon UI like your layout */}
            <InputGroup className="mb-3 mt-3">
              <Form.Control
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button variant="outline-secondary">
                <FontAwesomeIcon icon={faTag} />
              </Button>
            </InputGroup>

            <Button
              variant="warning"
              className="w-100 checkout-btn"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner size="sm" animation="border" /> : "Place Your Order and Pay"}
            </Button>
          </aside>
        </Col>
      </Row>

      {/* Modal UI (Add only) */}
      <Modal show={showModal} onHide={handleModalClose} centered>
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
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                name="cardName"
                placeholder="Enter cardholder name"
                value={newCard.cardName}
                onChange={handleModalChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
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
    </Container>
  );
}
