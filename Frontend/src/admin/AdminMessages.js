import React, { useEffect, useState } from "react";
import { Table, Container, Alert, Spinner } from "react-bootstrap";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("authToken");
      try {
        // Ensure this URL matches your backend route
        const res = await fetch("http://localhost:8083/api/admin/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        } else {
          setError("Failed to fetch messages. Make sure you are an Admin.");
        }
      } catch (err) {
        console.error(err);
        setError("Network error connecting to backend.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">User Messages</h2>

      {loading && <Spinner animation="border" variant="primary" />}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead className="bg-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Date Sent</th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? (
              messages.map((msg) => (
                <tr key={msg.id}>
                  <td>{msg.id}</td>
                  <td>
                    {msg.first_name} {msg.last_name}
                  </td>
                  <td>{msg.email}</td>
                  <td>{msg.message}</td>
                  <td>
                    {new Date(msg.created_at).toLocaleDateString()}{" "}
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No messages found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminMessages;
