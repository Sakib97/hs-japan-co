import styles from "../styles/AdmissionProcessComp.module.css";

const AdmissionProcessComp = () => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Admission Process</h3>
      <div className={styles.contactItem}>
        <i className="fa-solid fa-phone" />
        <span>+881 77655 4321</span>
      </div>
      <div className={styles.contactItem}>
        <i className="fa-solid fa-envelope" />
        <span>info@hsjapan.co.jp</span>
      </div>
    </div>
  );
};

export default AdmissionProcessComp;
