import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card, Form, Modal } from "react-bootstrap";
import "../styles/Checkout-Address.css";

// --- Helper Functions ---
const formatCurrency = (v) => `$${Number(v || 0).toFixed(2)}`;
const estimatedDelivery = (daysFromNow = 5) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

const emptyAddress = { name: "", label: "HOME", address: "", contact: "" };

export default function CheckoutAddress() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(emptyAddress);
  const [editingIdx, setEditingIdx] = useState(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) setCartItems(JSON.parse(savedCart));

    const fetchUserAddress = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8083/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;

        const data = await res.json();

        //only add if backend has an address
        if (data?.address) {
          setAddresses([
            {
              name: data.name || "My Profile",
              label: "SAVED",
              address: data.address,
              contact: data.phone || "",
            },
          ]);
          setSelectedIdx(0);
        }
      } catch (e) {
        console.error("Failed to fetch user address", e);
      }
    };

    fetchUserAddress();
  }, []);

  const price = cartItems.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 0), 0);
  const discount = 0;
  const total = price - discount;

  const handleContinue = () => {
    if (selectedIdx === null || !addresses[selectedIdx]) {
      alert("Please add/select an address first.");
      return;
    }
    const selected = addresses[selectedIdx];
    localStorage.setItem("shippingAddress", selected.address);
    navigate("/shipping");
  };

  const handleShowEditModal = (idx) => {
    setIsEditing(true);
    setEditingIdx(idx);
    setCurrentAddress(addresses[idx]);
    setShowModal(true);
  };

  const handleShowAddModal = () => {
    setIsEditing(false);
    setEditingIdx(null);
    setCurrentAddress(emptyAddress);
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  const handleModalSave = () => {
    if (!currentAddress.name || !currentAddress.address) {
      alert("Name and Address are required.");
      return;
    }

    if (isEditing && editingIdx !== null) {
      setAddresses((prev) => prev.map((a, i) => (i === editingIdx ? currentAddress : a)));
      setSelectedIdx(editingIdx);
    } else {
      setAddresses((prev) => {
        const next = [...prev, currentAddress];
        setSelectedIdx(next.length - 1);
        return next;
      });
    }

    setShowModal(false);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setCurrentAddress((prev) => ({ ...prev, [name]: value }));
  };

  const removeAddress = (idx) => {
    setAddresses((prev) => {
      const next = prev.filter((_, i) => i !== idx);

      if (next.length === 0) {
        setSelectedIdx(null);
      } else if (selectedIdx === idx) {
        setSelectedIdx(Math.max(0, idx - 1));
      } else if (selectedIdx > idx) {
        setSelectedIdx(selectedIdx - 1);
      }

      return next;
    });
  };

  return (
    <>
      <Container className="checkout-container my-5">
        <Row>
          <Col lg={8}>
            <div className="steps-container">
              <span className="step-active">Address</span>
              <span className="step">Shipping</span>
              <span className="step">Payment</span>
            </div>

            <h3 className="mt-4 mb-3">Select Delivery Address</h3>

            {/*If none yet */}
            {addresses.length === 0 ? (
              <Card className="mb-3">
                <Card.Body>
                  <p className="mb-2">No saved address yet.</p>
                  <Button variant="outline-primary" onClick={handleShowAddModal}>
                    + Add New Address
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <>
                {addresses.map((addr, idx) => (
                  <Card
                    className={`address-box mb-3 ${selectedIdx === idx ? "border-primary" : ""}`}
                    key={idx}
                  >
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
                        <Button variant="link" size="sm" onClick={() => handleShowEditModal(idx)}>
                          Edit
                        </Button>
                        <span>|</span>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger"
                          onClick={() => removeAddress(idx)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}

                <Button variant="outline-primary" onClick={handleShowAddModal}>
                  + Add New Address
                </Button>
              </>
            )}
          </Col>

          <Col lg={4}>
            <aside className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-line"><span>Price</span><span>{formatCurrency(price)}</span></div>
              <div className="summary-line"><span>Discount</span><span>− {formatCurrency(discount)}</span></div>
              <div className="summary-line"><span>Shipping</span><span className="free-shipping">Calculated next step</span></div>
              <hr />
              <div className="summary-total"><span>TOTAL</span><span>{formatCurrency(total)}</span></div>
              <p className="delivery-date">
                Estimated Delivery by <strong>{estimatedDelivery()}</strong>
              </p>

              <Button variant="warning" className="w-100 checkout-btn" onClick={handleContinue}>
                Continue to Shipping
              </Button>
              <Button variant="outline-secondary" className="w-100 mt-2" onClick={() => navigate("/cart")}>
                Back to Cart
              </Button>
            </aside>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Address" : "Add New Address"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={currentAddress.name} onChange={handleModalChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Label</Form.Label>
              <Form.Control name="label" value={currentAddress.label} onChange={handleModalChange} />
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
              <Form.Label>Contact</Form.Label>
              <Form.Control name="contact" value={currentAddress.contact} onChange={handleModalChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>Close</Button>
          <Button variant="primary" onClick={handleModalSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
