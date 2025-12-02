import React, { useState } from 'react';
import { Table, Button, Form, InputGroup, Badge, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faSearch, faUserCheck, faUserSlash } from '@fortawesome/free-solid-svg-icons';

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Juan Dela Cruz', email: 'juan@gmail.com', role: 'Customer', status: 'Active' },
    { id: 2, name: 'Maria Clara', email: 'maria@admin.com', role: 'Admin', status: 'Active' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
  };

  const handleDelete = (id) => {
    if(window.confirm("Remove user?")) setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h3 className="fw-bold mb-4">Manage Users</h3>

      <Row className="mb-3">
        <Col md={5}>
          <InputGroup>
              <InputGroup.Text className="bg-white"><FontAwesomeIcon icon={faSearch}/></InputGroup.Text>
              <Form.Control placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </InputGroup>
        </Col>
      </Row>

      <Table hover className="align-middle">
        <thead className="table-orange-header">
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u.id}>
              <td>#{u.id}</td>
              <td className="fw-bold">{u.name}</td>
              <td>{u.email}</td>
              <td><Badge bg={u.role === 'Admin' ? 'warning' : 'secondary'} text={u.role === 'Admin' ? 'dark' : 'white'}>{u.role}</Badge></td>
              <td><Badge bg={u.status === 'Active' ? 'success' : 'secondary'}>{u.status}</Badge></td>
              <td>
                <Button variant={u.status === 'Active' ? 'outline-secondary' : 'outline-success'} size="sm" className="me-2" onClick={() => toggleStatus(u.id)}>
                   <FontAwesomeIcon icon={u.status === 'Active' ? faUserSlash : faUserCheck} />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(u.id)}>
                   <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;