import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../styles/ProgramComp.module.css";
import EnquiryFormComp from "../../onlineAdmission/components/EnquiryFormComp";

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
            
            <EnquiryFormComp />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProgramComp;
