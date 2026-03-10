import styles from "../styles/FooterComp.module.css";

const FooterComp = () => {
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
                  <a href="#">Admission</a>
                </li>
                <li>
                  <a href="#">Online Admission</a>
                </li>
                <li>
                  <a href="#">Why Japan</a>
                </li>
                <li>
                  <a href="#">Our Team</a>
                </li>
                <li>
                  <a href="#">Contact Us</a>
                </li>
              </ul>
            </div>

            <div className={styles.linksColumn}>
              <h3 className={styles.columnTitle}>QUICK LINKS</h3>
              <ul className={styles.linksList}>
                <li>
                  <a href="#">About Us</a>
                </li>
                <li>
                  <a href="#">School Feature</a>
                </li>
                <li>
                  <a href="#">School Map</a>
                </li>
                <li>
                  <a href="#">Gallery</a>
                </li>
                <li>
                  <a href="#">FAQ's</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.container}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              Copyright &copy; 2024 Hs Japan Academy All Rights Reserved
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>
                <i className="fa-brands fa-facebook-f" />
                <span>Facebook</span>
              </a>
              <a href="#" className={styles.socialLink}>
                <i className="fa-brands fa-twitter" />
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComp;
