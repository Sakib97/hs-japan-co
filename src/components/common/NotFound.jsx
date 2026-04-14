import { Link } from "react-router-dom";
import styles from "../styles/NotFound.module.css";

const NotFound = () => {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.code}>404</div>
        <div className={styles.divider} />
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.subtitle}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className={styles.btn}>
          <i className="fa-solid fa-house"></i> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
