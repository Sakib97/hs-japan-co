import styles from "../styles/OnlineAdmBannerComp.module.css";

const OnlineAdmBannerComp = () => {
  return (
    <section className={styles.banner}>
      <div className={styles.overlay} />
      <div className={styles.container}>
        <h1 className={styles.title}>Online Admission</h1>
        <p className={styles.subtitle}>
          Fill up this form and submit to us to complete your online admission
        </p>
      </div>
      {/* <div className={styles.breadcrumbBar}>
        <div className={styles.breadcrumbContainer}>
          <a href="/" className={styles.breadcrumbLink}>
            <i className="fa-solid fa-house" /> HOME
          </a>
          <span className={styles.separator}>/</span>
          <span className={styles.current}>ONLINE ADMISSION</span>
        </div>
      </div> */}
    </section>
  );
};

export default OnlineAdmBannerComp;
