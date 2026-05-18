import { Link } from "react-router";
import styles from "./Footer.module.css";


const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.topSection}>
        <div className={styles.container}>
          <div className={styles.columns}>
            <div className={styles.brandColumn}>
              <h3 className={styles.columnTitle}>HS JAPAN ACADEMY</h3>
              <p className={styles.brandDescription}>
                HS Japan Academy is a client-focused and result-driven Japanese
                language school that provides broad-based learning approaches
                and experience at an affordable fee.
              </p>
            </div>

            <div className={styles.linksColumn}>
              <h3 className={styles.columnTitle}>STUDY LINKS</h3>
              <ul className={styles.linksList}>
                <li>
                  <Link to="/admission">Admission</Link>
                </li>
                <li>
                  <Link to="/online-admission">Online Admission</Link>
                </li>
                <li>
                  <Link to="/why-japan">Why Japan</Link>
                </li>
                <li>
                  <Link to="/team">Our Team</Link>
                </li>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
              </ul>
            </div>

            <div className={styles.linksColumn}>
              <h3 className={styles.columnTitle}>QUICK LINKS</h3>
              <ul className={styles.linksList}>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                {/* <li>
                  <a href="#">School Feature</a>
                </li>
                <li>
                  <a href="#">School Map</a>
                </li> */}
                <li>
                  <Link to="/gallery">Gallery</Link>
                </li>
                {/* <li>
                  <a href="#">FAQ's</a>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.container}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              Copyright &copy; {new Date().getFullYear()} Hs Japan Academy All Rights Reserved
            </p>
            <div className={styles.socialLinks}>
              <a target="_blank" rel="noopener noreferrer" href="#" className={styles.socialLink}>
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a target="_blank" rel="noopener noreferrer" href="#" className={styles.socialLink}>
                <i className="fi fi-brands-twitter-alt"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
