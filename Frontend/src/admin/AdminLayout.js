import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faBoxOpen,
  faUsers,
  faSignOutAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

// CSS for Sidebar
import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);

  // 1. Get Admin Info on Load
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user && user.role === "admin") {
      setAdminUser(user);
    } else {
      // Optional: Redirect if not authorized
      // navigate('/');
    }
  }, [navigate]);

  // 2. Logout Function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("authUpdated")); // Notify Navbar
    navigate("/login");
  };

  return (
    <Container fluid className="p-0 overflow-hidden">
      <Row className="flex-nowrap g-0">
        {/* Sidebar */}
        <Col
          md={2}
          className="sidebar bg-dark text-white min-vh-100 d-flex flex-column p-3 sticky-top"
        >
          <h4 className="text-center fw-bold mb-4 text-orange">PawSy Admin</h4>

          {/* --- NAV SECTION --- */}
          <Nav className="flex-column flex-grow-1">
            <Nav.Item className="mb-2">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `nav-link text-white d-flex align-items-center p-2 rounded ${
                    isActive ? "active-link" : ""
                  }`
                }
              >
                <FontAwesomeIcon icon={faTachometerAlt} className="me-3" />
                Dashboard
              </NavLink>
            </Nav.Item>

            <Nav.Item className="mb-2">
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `nav-link text-white d-flex align-items-center p-2 rounded ${
                    isActive ? "active-link" : ""
                  }`
                }
              >
                <FontAwesomeIcon icon={faBoxOpen} className="me-3" /> Products
              </NavLink>
            </Nav.Item>

            <Nav.Item className="mb-2">
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `nav-link text-white d-flex align-items-center p-2 rounded ${
                    isActive ? "active-link" : ""
                  }`
                }
              >
                <FontAwesomeIcon icon={faUsers} className="me-3" /> Users
              </NavLink>
            </Nav.Item>

            {/* --- FIX: MOVED INSIDE <Nav> --- */}
            <Nav.Item className="mb-2">
              <NavLink
                to="/admin/messages"
                className={({ isActive }) =>
                  `nav-link text-white d-flex align-items-center p-2 rounded ${
                    isActive ? "active-link" : ""
                  }`
                }
              >
                <FontAwesomeIcon icon={faEnvelope} className="me-3" /> Messages
              </NavLink>
            </Nav.Item>
            {/* ------------------------------- */}
          </Nav>

          {/* 3. Admin Profile & Logout Section */}
          <div className="mt-auto pt-3 border-top border-secondary">
            <div className="d-flex align-items-center mb-3 px-2">
              <FontAwesomeIcon
                icon={faUserCircle}
                size="2x"
                className="text-secondary me-2"
              />
              <div>
                <div
                  className="fw-bold text-white"
                  style={{ fontSize: "0.9rem" }}
                >
                  {adminUser ? adminUser.name : "Admin"}
                </div>
                <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                  {adminUser ? adminUser.email : ""}
                </small>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Logout
            </button>
          </div>
        </Col>

        {/* Main Content */}
        <Col
          md={10}
          className="main-content bg-light p-4 overflow-auto"
          style={{ height: "100vh" }}
        >
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;
