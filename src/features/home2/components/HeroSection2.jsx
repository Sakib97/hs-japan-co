import { Button } from "antd";
import { Link } from "react-router-dom";
import styles from "./HeroSection2.module.css";

const HeroSection2 = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.heading}>
          Your Journey to  
          <br />
          Japanese Fluency Starts Here

        </h1>
        <p className={styles.subheading}>
          Expert language training, visa consultancy, and immigration services
          tailored for ambitious students and professionals aiming for
          excellence in Japan.
        </p>
        <div className={styles.btnGroup}>
          <Link to="/courses">
            <Button type="primary" size="large" className={styles.btnPrimary}>
              Explore Programs
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="large" className={styles.btnSecondary}>
              Free Consultation
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection2;
