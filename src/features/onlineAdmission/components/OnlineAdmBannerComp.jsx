import styles from "../styles/OnlineAdmBannerComp.module.css";

const OnlineAdmBannerComp = () => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Online Admission</h1>
      <p className={styles.subtitle}>
        Complete the form below to begin your journey with HS Japan Academy.
      </p>
    </div>
  );
};

export default OnlineAdmBannerComp;
