import React from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import styles from "../styles/ProgramComp.module.css";

const ProgramComp = () => {
  return (
    <section className={styles.programSection}>
      <Container>
        <h2 className={`mb-5 ${styles.mainTitle}`}>Training Programme</h2>
        <Row>
          <Col lg={7} md={12}>
            <Row className={styles.featuresRow}>
              <Col md={6}>
                <div className={styles.featureItem}>
                  <div className={styles.iconWrapper}>
                    <i className="fi fi-rr-document-signed"></i>
                  </div>
                  <h5>Training on Japanese culture and Traditions</h5>
                  <p>
                    We are highly concern about our student carrier, so we can
                    necessary step for our student.
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className={styles.featureItem}>
                  <div className={styles.iconWrapper}>
                    <i className="fi fi-rr-graduation-cap"></i>
                  </div>
                  <h5>Free First Lesson</h5>
                  <p>
                    Student have opportunity to do some free class to ensure
                    about our service and procedure.
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className={styles.featureItem}>
                  <div className={styles.iconWrapper}>
                    <i className="fi fi-rr-screen"></i>
                  </div>
                  <h5>Specified Skilled Worker (SSW)</h5>
                  <p>
                    Japanese Government has officially started a new job visa in
                    2020 which allow foreign workers to join the country's labor
                    force. This initiative is taken by the government as the
                    number of working population is growing aged. 14 industries
                    are covered in SSW.
                  </p>
                </div>
              </Col>
              <Col md={6}>
                <div className={styles.featureItem}>
                  <div className={styles.iconWrapper}>
                    <i className="fi fi-rr-comment-question"></i>
                  </div>
                  <h5>FAQ</h5>
                  <p>
                    We have regular Quiz to make sure about their batter
                    preparation.
                  </p>
                </div>
              </Col>
            </Row>
          </Col>
          <Col
            lg={5}
            md={12}
            className="position-relative d-flex align-items-center justify-content-center"
          >
            <div className={styles.formContainer}>
              <div className={styles.yellowCircle}></div>
              <Card className={styles.contactCard}>
                <Card.Body className="p-1 p-md-4 p-lg-5">
                  <Card.Title className={`mb-3 mb-md-4 ${styles.cardTitle}`}>
                    Join over{" "}
                    <span className={styles.highlightText}>1500 students</span>{" "}
                    who've now registered for their courses. Don't miss out.
                  </Card.Title>
                  <Form>
                    <Form.Group controlId="formFullName">
                      <Form.Control
                        type="text"
                        placeholder="Enter Your Full Name"
                        className={styles.formControl}
                      />
                    </Form.Group>

                    <Form.Group controlId="formEmail">
                      <Form.Control
                        type="email"
                        placeholder="Email Address"
                        className={styles.formControl}
                      />
                    </Form.Group>

                    <Form.Group controlId="formAddress">
                      <Form.Control
                        type="text"
                        placeholder="Current Address"
                        className={styles.formControl}
                      />
                    </Form.Group>

                    <Form.Group controlId="formPhone">
                      <Form.Control
                        type="tel"
                        placeholder="Phone No"
                        className={styles.formControl}
                      />
                    </Form.Group>

                    <Button
                      variant="primary"
                      type="submit"
                      className={`w-100 ${styles.submitButton}`}
                    >
                      Apply Today
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProgramComp;
