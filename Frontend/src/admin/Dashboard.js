import React, { useState, useEffect } from "react";
import { Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faUsers,
  faDollarSign,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:8083/api";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [stats, setStats] = useState([
    { title: "Total Products", value: "0", icon: faBox, color: "text-primary", bg: "bg-primary-subtle" },
    { title: "Total Users", value: "0", icon: faUsers, color: "text-info", bg: "bg-info-subtle" },
    { title: "Total Sales", value: "$0.00", icon: faDollarSign, color: "text-success", bg: "bg-success-subtle" },
    { title: "Orders", value: "0", icon: faShoppingBag, color: "text-warning", bg: "bg-warning-subtle" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");

      try {
        const response = await fetch(`${API_URL}/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        setStats([
          { title: "Total Products", value: data.total_products, icon: faBox, color: "text-primary", bg: "bg-primary-subtle" },
          { title: "Total Users", value: data.total_users, icon: faUsers, color: "text-info", bg: "bg-info-subtle" },
          { title: "Total Sales", value: `$${Number(data.total_sales).toFixed(2)}`, icon: faDollarSign, color: "text-success", bg: "bg-success-subtle" },
          { title: "Total Orders", value: data.total_orders, icon: faShoppingBag, color: "text-warning", bg: "bg-warning-subtle" },
        ]);
      } catch (error) {
        console.error("Error:", error);
        setError("Could not load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) return <div className="text-center py-5"><Spinner animation="border" variant="warning" /></div>;

  return (
    // --- 1. APPLIED THE WHITE CARD CONTAINER HERE ---
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0">Dashboard Overview</h3>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {stats.map((stat, index) => (
          <Col md={3} className="mb-4" key={index}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center p-4">
                <div
                  className={`rounded-circle p-3 me-3 ${stat.bg} ${stat.color}`}
                  style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <FontAwesomeIcon icon={stat.icon} size="lg" />
                </div>
                <div>
                  <h6 className="text-muted mb-1 small fw-bold text-uppercase">
                    {stat.title}
                  </h6>
                  <h3 className="fw-bold mb-0 text-dark">{stat.value}</h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;