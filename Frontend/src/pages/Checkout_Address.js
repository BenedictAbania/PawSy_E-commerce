import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// ADDED 'Alert' to this list below:
import { Container, Row, Col, Button, Card, Form, Modal, Spinner, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import CheckoutSteps from '../components/CheckoutSteps';
import "../styles/Checkout-Address.css";

// --- Helper Functions ---
const formatCurrency = (v) => `$${Number(v || 0).toFixed(2)}`;
const estimatedDelivery = (daysFromNow = 5) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

const emptyAddress = { name: "", label: "Home", address: "", contact: "" };

export default function CheckoutAddress() {
  const navigate = useNavigate();

  // --- State ---
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0); // Default to first address
  const [cartItems, setCartItems] = useState([]);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(emptyAddress);
  const [editingIdx, setEditingIdx] = useState(null);

  // --- Load Data ---
  useEffect(() => {
    // 1. Load Cart
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) setCartItems(JSON.parse(savedCart));

    // 2. Fetch User Address from Backend
    const fetchUserAddress = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8083/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const data = await res.json();
          // If the user has a saved address in DB, add it to the list
          if (data?.address) {
            setAddresses([
              {
                name: data.name || "My Saved Address",
                label: "Default",
                address: data.address,
                contact: data.phone || "No contact provided",
              },
            ]);
          }
        }
      } catch (e) {
        console.error("Failed to fetch user address", e);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAddress();
  }, []);

  // --- Calculations ---
  const subtotal = cartItems.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 0), 0);
  const shippingCost = 0; // Calculated next step usually, simplified here
  const total = subtotal + shippingCost;

  // --- Handlers ---
  const handleContinue = () => {
    if (addresses.length === 0) {
      // This is the standard browser alert, not the component
      alert("Please add an address first.");
      return;
    }
    
    // Save selected address to Local Storage for the next steps
    const selected = addresses[selectedIdx];
    localStorage.setItem("shippingAddress", selected.address); 
    
    navigate("/shipping");
  };

  // Modal Handlers
  const handleShowAddModal = () => {
    setIsEditing(false);
    setEditingIdx(null);
    setCurrentAddress(emptyAddress);
    setShowModal(true);
  };

  const handleShowEditModal = (idx, e) => {
    e.stopPropagation(); // Prevent selecting the card when clicking edit
    setIsEditing(true);
    setEditingIdx(idx);
    setCurrentAddress(addresses[idx]);
    setShowModal(true);
  };

  const handleModalSave = () => {
    if (!currentAddress.name || !currentAddress.address) {
      alert("Name and Address are required.");
      return;
    }

    if (isEditing && editingIdx !== null) {
      setAddresses((prev) => prev.map((a, i) => (i === editingIdx ? currentAddress : a)));
    } else {
      setAddresses((prev) => [...prev, currentAddress]);
      setSelectedIdx(addresses.length); // Select the new one
    }

    setShowModal(false);
  };

  const removeAddress = (idx, e) => {
    e.stopPropagation();
    if(!window.confirm("Remove this address?")) return;

    setAddresses((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      // Adjust selected index
      if (next.length === 0) setSelectedIdx(0);
      else if (selectedIdx >= idx) setSelectedIdx(Math.max(0, selectedIdx - 1));
      return next;
    });
  };

  if (loading) return <div className="text-center my-5"><Spinner animation="border" variant="warning" /></div>;

  return (
    <>
      <Container className="my-5">
        {/* Unified Checkout Steps Component */}
        <CheckoutSteps activeStep="address" />

        <Row>
          {/* LEFT COLUMN: Address Selection */}
          <Col lg={8}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="mb-0">Select Delivery Address</h3>
              <Button variant="outline-primary" size="sm" onClick={handleShowAddModal}>
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add New Address
              </Button>
            </div>

            {addresses.length === 0 ? (
              <Alert variant="info">
                You have no saved addresses. Please add one to continue.
              </Alert>
            ) : (
              addresses.map((addr, idx) => (
                <Card 
                  key={idx} 
                  className={`mb-3 address-card ${selectedIdx === idx ? 'border-warning shadow-sm' : ''}`}
                  onClick={() => setSelectedIdx(idx)}
                  style={{ cursor: 'pointer', borderWidth: selectedIdx === idx ? '2px' : '1px' }}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex gap-3">
                        <Form.Check 
                          type="radio" 
                          name="addressGroup"
                          checked={selectedIdx === idx}
                          onChange={() => setSelectedIdx(idx)}
                          style={{ marginTop: '5px' }}
                        />
                        <div>
                          <h5 className="mb-1">
                            {addr.name} 
                            <span className="badge bg-secondary ms-2" style={{fontSize: '0.7em', fontWeight: 'normal'}}>
                              {addr.label}
                            </span>
                          </h5>
                          <p className="mb-1 text-muted">{addr.address}</p>
                          <small className="text-muted">Contact: {addr.contact}</small>
                        </div>
                      </div>
                      
                      <div className="d-flex gap-2">
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="text-primary"
                          onClick={(e) => handleShowEditModal(idx, e)}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="text-danger"
                          onClick={(e) => removeAddress(idx, e)}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>

          {/* RIGHT COLUMN: Order Summary */}
          <Col lg={4}>
            <aside className="order-summary p-4 bg-white rounded shadow-sm border">
              <h4 className="mb-4">Order Summary</h4>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span className="text-muted fst-italic">Calculated next step</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-4 fw-bold fs-5">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <div className="mb-4 text-muted small">
                Estimated Delivery by <strong>{estimatedDelivery()}</strong>
              </div>

              <Button 
                variant="warning" 
                className="w-100 py-2 fw-bold text-white" 
                onClick={handleContinue}
                disabled={addresses.length === 0}
              >
                Continue to Shipping
              </Button>

              <Button 
                variant="link" 
                className="w-100 mt-2 text-decoration-none text-secondary" 
                onClick={() => navigate("/cart")}
              >
                Back to Cart
              </Button>
            </aside>
          </Col>
        </Row>
      </Container>

      {/* --- Add/Edit Modal --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Address" : "Add New Address"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control 
                name="name" 
                value={currentAddress.name} 
                onChange={(e) => setCurrentAddress({...currentAddress, name: e.target.value})} 
                placeholder="e.g. John Doe"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Address Label</Form.Label>
              <Form.Control 
                name="label" 
                value={currentAddress.label} 
                onChange={(e) => setCurrentAddress({...currentAddress, label: e.target.value})} 
                placeholder="e.g. Home, Office"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Full Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={currentAddress.address}
                onChange={(e) => setCurrentAddress({...currentAddress, address: e.target.value})}
                placeholder="Street, City, Province, Zip Code"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Contact Number</Form.Label>
              <Form.Control 
                name="contact" 
                value={currentAddress.contact} 
                onChange={(e) => setCurrentAddress({...currentAddress, contact: e.target.value})} 
                placeholder="e.g. 0912 345 6789"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleModalSave}>Save Address</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}