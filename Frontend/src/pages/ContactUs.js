// src/pages/ContactUs.js
import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope, faClock } from "@fortawesome/free-regular-svg-icons";

import "../styles/ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-page">
      <Container className="my-5">
        <Row className="justify-content-center align-items-start">
          {/* Contact Form */}
          <Col md={6} className="mb-5">
            <div className="contact-form p-4 shadow-sm rounded bg-light">
              <h3 className="mb-4">Get in Touch</h3>
              <Form>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="firstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control type="text" placeholder="First name" />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="lastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control type="text" placeholder="Last name" />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" placeholder="E-mail address" />
                </Form.Group>
                <Form.Group controlId="message" className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Your message..."
                  />
                </Form.Group>
                <Button className="send-btn w-100">Send Message</Button>
              </Form>
            </div>
          </Col>

          {/* Contact Info */}
          <Col md={6}>
            <h3 className="mb-4">Feel free to contact us</h3>
            <p className="text-muted">
              We'd love to hear from you! Whether you have questions about your
              order or need product advice, our team is always ready to help.
            </p>

            <ul className="contact-info list-unstyled mt-4">
              <li className="d-flex align-items-start mb-3">
                <span className="icon-circle me-3"><FontAwesomeIcon icon={faLocationDot} /></span>
                <div>
                  <strong>
                    Katapatan Homes, Brgy. Banay-banay, Cabuyao, Laguna, Philippines</strong>
                </div>
              </li>

              <li className="d-flex align-items-start mb-3">
                <span className="icon-circle me-3"><FontAwesomeIcon icon={faEnvelope} /></span>
                <div>
                  <strong>groupone@outlook.com</strong>
                </div></li>

              <li className="d-flex align-items-start mb-3">
                <span className="icon-circle me-3"><FontAwesomeIcon icon={faPhone} /></span>
                <div><strong>+775 378-6348</strong></div>
              </li>

              <li className="d-flex align-items-start mb-3">
                <span className="icon-circle me-3"><FontAwesomeIcon icon={faClock} /></span>
                <div> <strong>Mon - Fri: 10AM - 10PM</strong></div>
              </li>
            </ul>
          </Col>
        </Row>

        {/* Social Media Section */}
        <section className="social-section text-center mt-5"><h4 className="social">Social Media Links</h4>
          <p className="text-muted"> Follow us for the latest deals, pet tips, and adorable moments! </p>
        </section>
      </Container>
    </div>
  );
};

export default ContactUs;
