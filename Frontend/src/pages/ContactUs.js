import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope, faClock } from "@fortawesome/free-regular-svg-icons";
import "../styles/ContactUs.css";

const ContactUs = () => {
  // 1. State for form data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    message: "",
  });

  // 2. State for handling status (loading, success, error)
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // 4. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page refresh
    setIsSubmitting(true);
    setStatus({ type: "", msg: "" });

    try {
      // Send data to Backend
      const response = await fetch("http://localhost:8083/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({
          type: "success",
          msg: "Message sent successfully! We will get back to you soon.",
        });
        setFormData({ first_name: "", last_name: "", email: "", message: "" }); // Clear form
      } else {
        const errorData = await response.json();
        setStatus({
          type: "danger",
          msg: errorData.message || "Failed to send message.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus({
        type: "danger",
        msg: "Network error. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <Container className="my-5">
        <Row className="justify-content-center align-items-start">
          {/* Contact Form */}
          <Col md={6} className="mb-5">
            <div className="contact-form p-4 shadow-sm rounded bg-light">
              <h3 className="mb-4">Get in Touch</h3>

              {/* Alert Message */}
              {status.msg && <Alert variant={status.type}>{status.msg}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="first_name">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="First name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="last_name">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Last name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="E-mail address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="message" className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button
                  className="send-btn w-100"
                  type="submit"
                  disabled={isSubmitting}
                  // --- CHANGE 1: Force background to black when submitting ---
                  style={
                    isSubmitting
                      ? {
                          backgroundColor: "black",
                          borderColor: "black",
                          color: "white",
                        }
                      : {}
                  }
                >
                  {isSubmitting ? (
                    <>
                      {/* --- CHANGE 2: Changed variant to "light" so it shows on black --- */}
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        variant="light"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </Form>
            </div>
          </Col>

          {/* Contact Info (Kept exactly as it was) */}
          <Col md={6}>
            <h3 className="mb-4">Feel free to contact us</h3>
            <p className="text-muted">
              We'd love to hear from you! Whether you have questions about your
              order or need product advice, our team is always ready to help.
            </p>

            <ul className="contact-info list-unstyled mt-4">
              <li className="d-flex align-items-start mb-3">
                <span className="icon-circle me-3">
                  <FontAwesomeIcon icon={faLocationDot} />
                </span>
                <div>
                  <strong>
                    Katapatan Homes, Brgy. Banay-banay, Cabuyao, Laguna,
                    Philippines
                  </strong>
                </div>
              </li>

              <li className="d-flex align-items-start mb-3">
                <span className="icon-circle me-3">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <div>
                  <strong>groupone@appdevproj.com</strong>
                </div>
              </li>

              <li className="d-flex align-items-start mb-3">
                <span className="icon-circle me-3">
                  <FontAwesomeIcon icon={faPhone} />
                </span>
                <div>
                  <strong>+63 444 555 666</strong>
                </div>
              </li>

              <li className="d-flex align-items-start mb-3">
                <span className="icon-circle me-3">
                  <FontAwesomeIcon icon={faClock} />
                </span>
                <div>
                  {" "}
                  <strong>Mon - Fri: 10AM - 10PM</strong>
                </div>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Social Media Section */}
        <section className="social-section text-center mt-5">
          <h4 className="social">Social Media Links</h4>
          <p className="text-muted">
            {" "}
            Follow us for the latest deals, pet tips, and adorable moments!{" "}
          </p>
        </section>
      </Container>
    </div>
  );
};

export default ContactUs;
