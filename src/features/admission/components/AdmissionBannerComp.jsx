import styles from "../styles/AdmissionBannerComp.module.css";

const AdmissionBannerComp = () => {
  return (
    <section className={styles.banner}>
      <div className={styles.overlay} />
      <div className={styles.container}>
        <h1 className={styles.title}>Admission</h1>
        <p className={styles.stat}>
          Over <span className={styles.highlight}>10000+</span> students come to
          Japan every year to fulfill their dream
        </p>
        
      </div>
    </section>
  );
};

export default AdmissionBannerComp;
