import { Link } from "react-router-dom";
import styles from "../styles/GalleryBannerComp.module.css";

const GalleryBannerComp = () => {
  return (
    <section className={styles.banner}>
      <div className={styles.overlay} />

      <div className={styles.titleArea}>
        <h1 className={styles.title}>Gallery</h1>
      </div>

      {/* <div className={styles.breadcrumbBar}>
        <div className={styles.container}>
          <Link to="/" className={styles.breadcrumbLink}>
            <i className="fa-solid fa-house" /> HOME
          </Link>
          <span className={styles.separator}>/</span>
          <span className={styles.current}>GALLERY</span>
        </div>
      </div> */}
    </section>
  );
};

export default GalleryBannerComp;
