import { Button } from "antd";
import { Link } from "react-router-dom";
import styles from "./CTASection.module.css";

const CTASection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h2 className={styles.title}>Ready to Start Your Journey?</h2>
          <p className={styles.subtitle}>
            Join 800+ students who have successfully moved to Japan through our
            academy. Your future starts today.
          </p>
        </div>
        <div className={styles.btnGroup}>
          <Link to="/online-admission">
            <Button type="primary" size="large" className={styles.btnPrimary}>
              Apply for Admission
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="large" className={styles.btnSecondary}>
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
