import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  InputGroup,
  Modal,
  Badge,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";

// POINT TO YOUR BACKEND
const API_URL = "http://localhost:8083/api/users";

// Icons
const IconPlus = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const IconSearch = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const IconEdit = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);
const IconTrash = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);
const IconSave = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ATTRIBUTES: Name, Email, Role, Password
  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: "",
    email: "",
    role: "user",
    password: "",
  });

  // 1. FETCH USERS (Read)
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentUser({
      id: null,
      name: "",
      email: "",
      role: "user",
      password: "",
    });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setCurrentUser({ ...user, password: "" }); // Don't show hashed password
    setShowModal(true);
  };

  // 2. DELETE USER
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        setUsers(users.filter((u) => u.id !== id));
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  // 3. SAVE (Create / Update)
  const handleSave = async () => {
    if (!currentUser.name || !currentUser.email)
      return alert("Please fill in required fields");

    try {
      let response;
      const headers = { "Content-Type": "application/json" };

      if (isEditing) {
        response = await fetch(`${API_URL}/${currentUser.id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify(currentUser),
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers,
          body: JSON.stringify(currentUser),
        });
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to save");
      }

      const savedUser = await response.json();

      if (isEditing) {
        setUsers(users.map((u) => (u.id === savedUser.id ? savedUser : u)));
      } else {
        setUsers([savedUser, ...users]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save user. Email might be taken.");
    }
  };

  const handleChange = (e) =>
    setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold m-0">Manage Users</h3>
        <Button className="btn-orange" onClick={handleAddNew}>
          <IconPlus /> <span className="ms-2">Add User</span>
        </Button>
      </div>

      <Row className="mb-3">
        <Col md={5}>
          <InputGroup>
            <InputGroup.Text className="bg-white border-end-0">
              <IconSearch />
            </InputGroup.Text>
            <Form.Control
              className="border-start-0 ps-0"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="warning" />
          <p className="mt-2 text-muted">Loading users...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead className="table-orange-header">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td className="text-muted">#{u.id}</td>
                  <td className="fw-bold">{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <Badge bg={u.role === "admin" ? "danger" : "success"}>
                      {u.role ? u.role.toUpperCase() : "USER"}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(u)}
                    >
                      <IconEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(u.id)}
                    >
                      <IconTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* MODAL for Add/Edit */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit" : "New"} User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                name="name"
                value={currentUser.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={currentUser.email}
                onChange={handleChange}
                placeholder="name@example.com"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={currentUser.role}
                onChange={handleChange}
              >
                <option value="user">User (Customer)</option>
                <option value="admin">Admin (Manager)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                {isEditing
                  ? "New Password (leave blank to keep current)"
                  : "Password"}
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={currentUser.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button className="btn-orange" onClick={handleSave}>
            <IconSave /> <span className="ms-2">Save</span>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
