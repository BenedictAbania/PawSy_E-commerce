import React, { useState, useEffect } from 'react';
import { Table, Form, Spinner, Alert } from 'react-bootstrap';
import '../admin/Admin.css'; 

const API_URL = 'http://localhost:8083/api';

const Transactions = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`${API_URL}/admin/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const token = localStorage.getItem("authToken");
    try {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      alert("Error updating status");
      fetchOrders();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'processing': return 'primary';
      case 'cancelled': return 'danger';
      default: return 'warning';
    }
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" variant="warning"/></div>;

  return (
    // --- 1. APPLIED THE WHITE CARD CONTAINER HERE ---
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0">Transaction History</h3>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="table-responsive">
        <Table hover className="align-middle">
          {/* --- 2. APPLIED ORANGE HEADER CLASS --- */}
          <thead className="table-orange-header">
            <tr>
              <th className="py-3 ps-3">Order ID</th>
              <th className="py-3">Customer</th>
              <th className="py-3">Date</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Payment</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-4">No transactions found.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="ps-3 fw-bold">#{order.id}</td>
                  <td>
                    <div className="fw-bold">{order.user?.name || "Unknown"}</div>
                    <div className="text-muted small">{order.user?.email}</div>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="fw-bold text-success">${Number(order.total_price).toFixed(2)}</td>
                  <td className="text-uppercase">{order.payment_method}</td>
                  <td>
                    <Form.Select 
                      size="sm" 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-${getStatusColor(order.status)} fw-bold border-${getStatusColor(order.status)}`}
                      style={{ width: '140px' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="returned">Returned</option>
                    </Form.Select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Transactions;