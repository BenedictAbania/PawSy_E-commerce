import React, { useState, useEffect } from "react";
import { Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faUsers,
  faDollarSign,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";

// POINT TO YOUR BACKEND
const API_URL = "http://localhost:8083/api";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Default state with 0s
  const [stats, setStats] = useState([
    { title: "Total Products", value: "0", icon: faBox, color: "text-primary" },
    { title: "Total Users", value: "0", icon: faUsers, color: "text-info" },
    { title: "Total Sales", value: "$0.00", icon: faDollarSign, color: "text-success" },
    { title: "Orders", value: "0", icon: faShoppingBag, color: "text-warning" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");

      try {
        // Fetch from your new consolidated Controller
        const response = await fetch(`${API_URL}/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`, // <--- CRITICAL for Sanctum
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = await response.json();

        // Update state with REAL database numbers
        setStats([
          {
            title: "Total Products",
            value: data.total_products,
            icon: faBox,
            color: "text-primary",
          },
          {
            title: "Total Users",
            value: data.total_users,
            icon: faUsers,
            color: "text-info",
          },
          {
            title: "Total Sales",
            // Format number to currency
            value: `$${Number(data.total_sales).toFixed(2)}`,
            icon: faDollarSign,
            color: "text-success",
          },
          {
            title: "Total Orders",
            value: data.total_orders,
            icon: faShoppingBag,
            color: "text-warning",
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Could not load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-2 text-muted">Loading overview...</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-dark fw-bold">Dashboard Overview</h3>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {stats.map((stat, index) => (
          <Col md={3} className="mb-4" key={index}>
            <Card className="border-0 shadow-sm p-3">
              <div className="d-flex align-items-center">
                <div
                  className={`rounded-circle bg-light p-3 me-3 ${stat.color}`}
                  style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <FontAwesomeIcon icon={stat.icon} size="lg" />
                </div>
                <div>
                  <h6 className="text-muted mb-1 small fw-bold">
                    {stat.title}
                  </h6>
                  <h3 className="fw-bold mb-0">{stat.value}</h3>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dashboard;