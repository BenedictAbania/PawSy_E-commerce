import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import heroPets from "../assets/about-pets.png";
import Christian from "../assets/christian.jpg";
import "../styles/AboutUs.css";

const AboutUs = () => {
  return (
    <>
      {/* ABOUT SECTION */}
      <section className="about-section py-5 bg-light">
        <Container>
          <Row className="justify-content-center text-center mb-4">
            <Col lg={8}>
              <h2 className="fw-bold">About our store</h2>
              <h5 className="about-us-text">
                Your Trusted Hub for All Things Pets
              </h5>
            </Col>
          </Row>

          <Row className="justify-content-center text-center mb-5">
            <Col md={5}>
              <p>
                At PawCentral, we believe every pet deserves the best care,
                comfort, and love. Our mission is to make pet parenting easier
                and happier by providing top-quality products, expert guidance,
                and a welcoming shopping experience.
              </p>
            </Col>
            <Col md={5}>
              <p>
                Whether you’re shopping for nutritious food, cozy beds, fun
                toys, or health essentials, PawCentral is your one-stop
                destination for everything your furry, feathery, or scaly
                friends need.
              </p>
            </Col>
          </Row>

          <Row className="text-center justify-content-center stats-row">
            <Col xs={6} sm={3}>
              <h3 className="about-text fw-bold">2k+</h3>
              <p>Happy Clients</p>
            </Col>
            <Col xs={6} sm={3}>
              <h3 className="about-text fw-bold">72</h3>
              <p>Brands</p>
            </Col>
            <Col xs={6} sm={3}>
              <h3 className="about-text fw-bold">1.8k+</h3>
              <p>Products</p>
            </Col>
            <Col xs={6} sm={3}>
              <h3 className="about-text fw-bold">28</h3>
              <p>Years in Business</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="why-choose-section py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center">
              <img
                src={heroPets}
                alt="Happy pets"
                className="about-hero-img "
              />
            </Col>

            <Col md={6}>
              <h3 className="fw-bold mb-4">Why Choose PawCentral?</h3>

              <div className="Why-choose-title mb-4">
                <h5>Handpicked Quality Products</h5>
                <p>
                  Every item in our store is carefully selected for safety,
                  comfort, and durability. We ensure the best quality standards
                  so your pet gets only the finest.
                </p>
              </div>

              <div className="Why-choose-title mb-4">
                <h5>Everything in One Place</h5>
                <p>
                  From grooming tools to nutritious food, toys, and accessories
                  — we’ve got everything your pet could ever need.
                </p>
              </div>

              <div className="Why-choose-title mb-4">
                <h5>Affordable and Accessible</h5>
                <p>
                  We make premium-quality pet care affordable for everyone.
                  Enjoy exclusive bundles and seasonal discounts to help you
                  shop smart.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section py-5 bg-light">
        <Container>
          <Row className="align-items-center justify-content-center">
            <h5 className="about-text fw-bold">Testemonials</h5>
            <h3 className="people-text fw-bold mb-5">
              What people say about us
            </h3>
            <Col md={7}>
              <blockquote className="blockquote text-center text-md-start">
                <p className="fs-5 fst-italic">
                  “I’m really impressed with the quality of the cat food and
                  litter I bought from PetCentral. Everything arrived neatly
                  packed, and the website was so easy to use. Definitely
                  recommending it to all my fellow dog lovers.”
                </p>
                <h5 className="mt-4 mb-0">
                  Christian B. <p id="owner">Dog Owner</p>
                </h5>
              </blockquote>
            </Col>
            <Col md={4} className="text-center mt-4 mt-md-0">
              <div className="testimonial-img-wrapper mx-auto">
                <div className="testimonial-circle shadow">
                  <img src={Christian} alt="cillian" className="Christian" />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* VISION & MISSION */}
      <section className="vision-mission-section py-5">
        <Container>
          <Row>
            <Col md={6} className="mb-4">
              <Card className="vision-card p-4 text-center">
                <Card.Title className="fw-bold text-uppercase mb-3">
                  Our Vision
                </Card.Title>
                <Card.Text>
                  Our vision is to build a community where every pet is loved,
                  cared for, and given the best quality of life possible. We
                  aspire to be the leading online hub for pet essentials in the
                  Philippines, known for our commitment to quality, compassion,
                  and sustainability. PetCentral envisions a future where caring
                  for pets goes hand in hand with caring for people and the
                  planet.
                </Card.Text>
              </Card>
            </Col>
            <Col md={6} className="mb-4">
              <Card className="mision-card p-4 text-center">
                <Card.Title className="fw-bold text-uppercase mb-3">
                  Our Mission
                </Card.Title>
                <Card.Text>
                  At PetCentral, our mission is to make pet care simple, joyful,
                  and accessible for everyone. We aim to provide high-quality,
                  safe, and affordable products that bring comfort and happiness
                  to every pet and peace of mind to every pet owner. Through
                  trust, care, and convenience, we strive to be every pet
                  lover’s most reliable partner in nurturing healthy and happy
                  companions.
                </Card.Text>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};
export default AboutUs;
