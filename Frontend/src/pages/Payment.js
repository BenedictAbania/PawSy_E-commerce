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
import CheckoutSteps from '../components/CheckoutSteps';
import "../styles/Payment.css";

const formatCurrency = (v) => `$${Number(v || 0).toFixed(2)}`;

export default function Payment() {
  const navigate = useNavigate();

  // --- STATE ---
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCost, setShippingCost] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default to COD (id: 'cod') until user picks something else
  const [selectedId, setSelectedId] = useState('cod'); 
  const [paymentMethods, setPaymentMethods] = useState([]);

  // coupon UI (optional)
  const [couponCode, setCouponCode] = useState("");
  const discount = 0;

  // modal state (ADD ONLY)
  const [showModal, setShowModal] = useState(false);
  const [newCard, setNewCard] = useState({
    type: "Visa",
    cardName: "",
    cardNumber: "",
    expiryDate: "", 
  });

  // --- LOAD DATA ---
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) setCartItems(JSON.parse(savedCart));

    const savedAddr = localStorage.getItem("shippingAddress");
    if (savedAddr) setShippingAddress(savedAddr);

    const savedShipCost = localStorage.getItem("shippingCost");
    if (savedShipCost) setShippingCost(Number(savedShipCost) || 0);

    // FETCH REAL PAYMENT METHODS
    const fetchPaymentMethods = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            const res = await fetch('http://localhost:8083/api/payment-methods', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            
            // Merge COD (static) with DB Cards
            const allMethods = [
                { id: 'cod', type: 'Cash on Delivery', logo: 'https://cdn-icons-png.flaticon.com/512/2331/2331941.png', code: 'cod' },
                ...data.map(card => ({
                    id: card.id,
                    type: card.type,
                    logo: card.type === 'Visa' ? "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" : "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
                    lastFour: card.last_four,
                    expiry: card.expiry_date,
                    code: card.type.toLowerCase()
                }))
            ];
            
            setPaymentMethods(allMethods);
        } catch (err) {
            console.error("Failed to load payment methods", err);
        }
    };

    fetchPaymentMethods();
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

  const handleModalSave = async () => {
    if (!newCard.cardNumber || !newCard.expiryDate) {
      alert("Please complete all fields.");
      return;
    }

    // Save to Backend so it persists
    const token = localStorage.getItem("authToken");
    try {
        const [year, month] = newCard.expiryDate.split('-');
        const formattedExpiry = `${month}/${year.slice(2)}`;

        const response = await fetch('http://localhost:8083/api/payment-methods', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                type: newCard.type,
                card_number: newCard.cardNumber,
                expiry_date: formattedExpiry
            })
        });

        if(response.ok) {
            // Reload list to see new card
            const res = await fetch('http://localhost:8083/api/payment-methods', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            
            const allMethods = [
                { id: 'cod', type: 'Cash on Delivery', logo: 'https://cdn-icons-png.flaticon.com/512/2331/2331941.png', code: 'cod' },
                ...data.map(card => ({
                    id: card.id,
                    type: card.type,
                    logo: card.type === 'Visa' ? "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" : "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
                    lastFour: card.last_four,
                    expiry: card.expiry_date,
                    code: card.type.toLowerCase()
                }))
            ];
            setPaymentMethods(allMethods);
            setShowModal(false);
            setNewCard({ type: "Visa", cardName: "", cardNumber: "", expiryDate: "" });
        } else {
            alert("Failed to save card");
        }
    } catch(e) {
        console.error(e);
    }
  };

  return (
    <Container className="payment-container my-5">
      <CheckoutSteps activeStep="payment" />

      <Row>
        <Col lg={8}>
          <h3 className="mb-3">Payment Method</h3>

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
          <aside className="order-summary p-4 bg-white rounded shadow-sm border">
            <h4 className="mb-4">Order Summary</h4>

            <div className="summary-line d-flex justify-content-between mb-2">
              <span>Price</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>

            <div className="summary-line d-flex justify-content-between mb-2">
              <span>Discount</span>
              <span>− {formatCurrency(discount)}</span>
            </div>

            <div className="summary-line d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span>
            </div>

            <hr />

            <div className="summary-total d-flex justify-content-between mb-4 fw-bold fs-5">
              <span>TOTAL</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>

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
              className="w-100 checkout-btn fw-bold text-white"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner size="sm" animation="border" /> : "Place Your Order and Pay"}
            </Button>
          </aside>
        </Col>
      </Row>

      {/* Modal UI */}
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