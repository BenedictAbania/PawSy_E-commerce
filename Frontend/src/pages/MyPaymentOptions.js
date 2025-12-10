import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Alert, Row, Col, Spinner, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { faCcVisa, faCcMastercard } from '@fortawesome/free-brands-svg-icons'; // Ensure you have brands installed
import '../styles/MyPaymentOptions.css'; 

const API_BASE_URL = 'http://localhost:8083/api';

const MyPaymentOptions = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newCard, setNewCard] = useState({
    type: 'Visa',
    cardNumber: '',
    expiryDate: '' // YYYY-MM from input
  });

  // 1. Fetch Cards from API
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/payment-methods`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCards(data);
      }
    } catch (err) {
      console.error("Error loading cards", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Add Card
  const handleSaveCard = async () => {
    if (!newCard.cardNumber || !newCard.expiryDate) {
      alert("Please fill in all fields");
      return;
    }

    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${API_BASE_URL}/payment-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: newCard.type,
          card_number: newCard.cardNumber,
          expiry_date: formatExpiry(newCard.expiryDate) // Format YYYY-MM to MM/YY
        })
      });

      if (response.ok) {
        await fetchCards(); // Reload list
        setShowModal(false);
        setNewCard({ type: 'Visa', cardNumber: '', expiryDate: '' });
      } else {
        alert("Failed to add card");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Delete Card
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this card?")) return;

    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${API_BASE_URL}/payment-methods/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setCards(cards.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper: Convert Input Date (2025-12) to Display Date (12/25)
  const formatExpiry = (dateString) => {
    if(!dateString) return "";
    const [year, month] = dateString.split('-');
    return `${month}/${year.slice(2)}`;
  };

  // Helper: Get Icon
  const getCardIcon = (type) => {
    if (type === 'Visa') return faCcVisa;
    if (type === 'Mastercard') return faCcMastercard;
    return faCreditCard;
  };

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>;

  return (
    <div className="container" style={{ marginTop: '20px', marginBottom: '50px' }}>
      <header className="mb-4">
        <nav className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/account">My Account</Link> / Payment Options
        </nav>
      </header>

      <main className="account-container">
        {/* --- SIDEBAR --- */}
        <aside className="sidebar">
          <nav className="account-nav">
            <div className="nav-section">
              <strong>Manage My Account</strong>
              <ul>
                <li><Link to="/account">My Profile</Link></li>
                <li className="active"><Link to="/my-payment-options">My Payment Options</Link></li>
              </ul>
            </div>
            <div className="nav-section">
              <strong>My Orders</strong>
              <ul>
                <li><Link to="/returns">My Returns</Link></li>
                <li><Link to="/cancellations">My Cancellations</Link></li>
                <li><Link to="/track-orders">Track Orders</Link></li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <section className="main-content">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>My Payment Options</h4>
            <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add New Card
            </Button>
          </div>

          {cards.length === 0 ? (
            <Alert variant="info">You have no saved payment methods.</Alert>
          ) : (
            <div className="payment-methods-grid">
              {cards.map((card) => (
                <div className="payment-card-item" key={card.id}>
                  <div className="card-content-wrapper">
                    <div className="card-details-left">
                      <div className="card-icon-box">
                        <FontAwesomeIcon icon={getCardIcon(card.type)} />
                      </div>
                      <div>
                        <div className="card-type-text">{card.type} •••• {card.last_four}</div>
                        <div className="card-expiry-text">Expires {card.expiry_date}</div>
                      </div>
                    </div>
                    <Button 
                      className="btn-delete-card" 
                      onClick={() => handleDelete(card.id)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Add Card Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Add New Card</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Card Type</Form.Label>
              <Form.Select 
                value={newCard.type} 
                onChange={(e) => setNewCard({...newCard, type: e.target.value})}
              >
                <option value="Visa">Visa</option>
                <option value="Mastercard">Mastercard</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control 
                placeholder="0000 0000 0000 0000"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control 
                type="month"
                value={newCard.expiryDate}
                onChange={(e) => setNewCard({...newCard, expiryDate: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveCard}>Save Card</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyPaymentOptions;