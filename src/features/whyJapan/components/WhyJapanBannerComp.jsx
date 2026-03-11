import styles from "../styles/WhyJapanBannerComp.module.css";

const WhyJapanBannerComp = () => {
  return (
    <section className={styles.banner}>
      <div className={styles.overlay} />
      <div className={styles.decorCircle} />
      <div className={styles.decorCircle2} />
      <div className={styles.breadcrumbBar}>
        <div className={styles.container}>
          <a href="/" className={styles.breadcrumbLink}>
            <i className="fa-solid fa-house" /> HOME
          </a>
          <span className={styles.separator}>/</span>
          <span className={styles.current}>WHY JAPAN</span>
        </div>
      </div>
    </section>
  );
};

export default WhyJapanBannerComp;
