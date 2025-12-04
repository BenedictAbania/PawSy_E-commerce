import React, { useState, useEffect } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
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
  const [stats, setStats] = useState([
    { title: "Total Products", value: "0", icon: faBox, color: "text-primary" },
    { title: "Total Users", value: "0", icon: faUsers, color: "text-info" },
    {
      title: "Total Sales",
      value: "$0.00",
      icon: faDollarSign,
      color: "text-success",
    },
    { title: "Orders", value: "0", icon: faShoppingBag, color: "text-warning" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch Product Count
        const prodRes = await fetch(`${API_URL}/products`);
        const prodData = await prodRes.json();
        const productCount = prodData.length;

        // 2. Fetch User Count
        const userRes = await fetch(`${API_URL}/users`);
        const userData = await userRes.json();
        const userCount = userData.length;

        // (Future: Fetch real sales/orders data when you have it)

        // 3. Update State
        setStats([
          {
            title: "Total Products",
            value: productCount,
            icon: faBox,
            color: "text-primary",
          },
          {
            title: "Total Users",
            value: userCount,
            icon: faUsers,
            color: "text-info",
          },
          // (Keep sales as placeholder for now)
          {
            title: "Total Sales",
            value: "$12,450",
            icon: faDollarSign,
            color: "text-success",
          },
          {
            title: "Orders",
            value: "12",
            icon: faShoppingBag,
            color: "text-warning",
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
      <Row>
        {stats.map((stat, index) => (
          <Col md={3} className="mb-4" key={index}>
            <Card className="border-0 shadow-sm p-3">
              <div className="d-flex align-items-center">
                <div
                  className={`rounded-circle bg-light p-3 me-3 ${stat.color}`}
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
